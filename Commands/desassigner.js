const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');

module.exports = {
    description: 'Enlève un bénévole de l\'écoute',
    options: [
        {
            name: 'bénévole',
            type: 'user',
            desc: 'bénévole à enlever de l\'écoute',
            required: true
        }
    ],
    run: async (Client, interaction) => {
        let user = interaction.options.getMember('bénévole');
        if (!user) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('db3226')
                    .setDescription(':x: | Merci de préciser le bénévole à enlever de l\'écoute.')
            ], ephemeral: true
        });

        let ticket = await Client.Ticket.findOne({ where: { channelID: interaction.channel.id }});
        if (!ticket) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('db3226')
                    .setDescription(':x: | Cette commande ne peut être effectuée que dans un salon d\'écoute !')
            ], ephemeral: true
        });

        let users = Object.values(JSON.parse(ticket.attributed));
        if (!users) users = [];

        if (!users.includes(user.user.id)) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('db3226')
                    .setDescription(':x: | Cet utilisateur n\'est pas dans l\'écoute actuellement !')
            ], ephemeral: true
        });

        await interaction.deferReply();

        let index = users.indexOf(user.user.id);
        if (index >= 0) users.splice(index, 1);

        await ticket.update({
            ticketID: ticket.ticketID,
            ownerID: ticket.ownerID,
            channelID: interaction.channel.id,
            attributed: JSON.stringify(users),
        });

        interaction.channel.permissionOverwrites.delete(user.user.id);

        let occupied = {};
        for (let user of JSON.parse(ticket.attributed)) {
            occupied[user] = false
        }
        let tickets = await Client.Ticket.findAll();
        for (let ticket of Object.values(tickets)) {
            let assigned = JSON.parse(ticket.attributed);
            for (let user of Object.keys(occupied)) {
                if (assigned.includes(user)) {
                    occupied[user] = true;
                }
            }
        }

        for (let user of Object.keys(occupied)) {
            if (!occupied[user]) {
                let userDB = await Client.available.findOne({ where: { userID: user }});
                if (userDB) {
                    await userDB.update({
                        userID: user,
                        occupied: false,
                    });
                }
            }
        }

        Client.functions.updateAvailable(Client);

        interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor('9bd2d2')
                    .setDescription(`:white_check_mark: | \`${interaction.user.tag}\` à enlevé \`${user.user.tag}\` de l'écoute.`)
            ]
        })
    }
}