const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');

module.exports = {
    description: 'Ajouter un nouveau bénévole à l\'écoute actuelle',
    options: [
        {
            name: 'bénévole',
            type: 'user',
            desc: 'Bénévole à ajouter à l\'écoute',
            required: true
        }
    ],
    run: async (Client, interaction) => {
        let user = interaction.options.getMember('bénévole');
        if (!user) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('db3226')
                    .setDescription(':x: | Merci de préciser un utilisateur à ajouter à l\'écoute !')
            ], ephemeral: true
        });

        let channel = interaction.channel;
        let ticket = await Client.Ticket.findOne({ where: { channelID: channel.id }});
        if (!ticket) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('db3226')
                    .setDescription(':x: | Cette commande n\'est utilisable que dans un salon d\'écoute !')
            ], ephemeral: true
        });

        let DBuser = await Client.available.findOne({ where: { userID: user.user.id } });
        if (!DBuser) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('db3226')
                    .setDescription(':x: | Ce bénévole ne semble pas etre dans la permanence !')
            ], ephemeral: true
        });

        await interaction.deferReply();

        const addUser = async () => {
            let reply = await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor('9bd2d2')
                        .setDescription(':satellite: | L\'utilisateur est en cours d\'ajout...')
                ], ephemeral: true
            });

            let spectators = await Client.spectators.findAll();
            for (let i in Object.keys(spectators)) {
                let user = await Client.users.fetch(spectators[i].userID);
                if (user) {
                    channel.permissionOverwrites.update(user, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: false
                    })
                }
            }

            channel.permissionOverwrites.create(user.user.id, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
            });

            DBuser.update({
                userID: user.user.id,
                occupied: true
            });

            let attributed;
            let first = false;
            if (ticket.attributed.length === 0) {
                attributed = [];
                first = true;
            }
            else attributed = JSON.parse(ticket.attributed);

            if (typeof attributed !== 'object') {
                let oldAttributed = attributed;
                attributed = [];
                attributed.push(oldAttributed)
            }

            attributed.push(user.user.id);

            ticket.update({
                ticketID: ticket.ticketID,
                ownerID: ticket.ownerID,
                channelID: channel.id,
                attributed: JSON.stringify(attributed),
            });

            reply.delete();

            if (first) {
                let row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('CloseTicket')
                            .setLabel('Fermer l\'écoute')
                            .setEmoji('⚠')
                            .setStyle('DANGER'),

                        new MessageButton()
                            .setCustomId('ReportTicket')
                            .setLabel('Vigileance')
                            .setEmoji('🔴')
                            .setStyle('SECONDARY'),

                        new MessageButton()
                            .setCustomId('AnonyLift')
                            .setLabel('Levée d\'identifiant')
                            .setEmoji('🆔')
                            .setStyle('SECONDARY')
                    )

                channel.bulkDelete(100)

                channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('9bd2d2')
                            .setDescription('💬 | Cette écoute est maintenant attribuée, tout message envoyé dans ce salon sera transmi à l\'utilisateur.')
                    ], components: [row], content: `<@${user.user.id}>`
                });
            }

            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('9bd2d2')
                        .setDescription(`:white_check_mark: | \`${interaction.user.tag}\` à ajouté \`${user.user.tag}\` à l'écoute.`)
                ]
            });

            Client.functions.updateAvailable(Client);
        }

        if (DBuser.occupied) {
            let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('confirm')
                        .setDisabled(false)
                        .setLabel('Confirmer')
                        .setStyle('DANGER'),

                    new MessageButton()
                        .setCustomId('cancel')
                        .setDisabled(false)
                        .setLabel('Annuler')
                        .setStyle('PRIMARY')
                );

            let confirm = await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor('ff7f01')
                        .setDescription(':warning: | L\'utilisateur séléctionné semble déja occupé, êtes vous sûr de vouloir l\'ajouter à l\'écoute ?')
                ], components: [row], ephemeral: true
            });

            const button = confirm.createMessageComponentCollector({ filter: () => true, time: 60000 });
            button.once('collect', i => {
                switch (i.customId) {
                    case 'confirm':
                        addUser()
                        break;

                    case 'cancel':
                        interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setColor('9bd2d2')
                                    .setDescription(':white_check_mark: | L\'annulation à bien été prise en compte !')
                            ], ephemeral: true
                        });
                        setTimeout(() => {
                            interaction.deleteReply();
                        }, 2000);
                        break;
                }
            });
        } else {
            addUser()
        }
    }
}