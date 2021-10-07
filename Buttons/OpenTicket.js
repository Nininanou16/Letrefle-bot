const {MessageActionRow, MessageButton, MessageEmbed, Permissions} = require('discord.js');

module.exports = async (Client, interaction, Ticket) => {

    async function genID() {
        let length = await Client.Historic.findAll();
        let currLength = await Client.Ticket.findAll();

        length = ((currLength.length+length.length)+1).toString();

        if (length.length < 5) {
            let missing = 5-length.length;

            function genMissing(len, str) {
                len--;
                if (!str) str = '0';
                else str = '0'+str

                if (len <= 0) return str;
                return genMissing(len, str);
            }

            let add = genMissing(missing)
            return add+length;
        }

        return length;
    }

    let hasTicket = await Client.Ticket.findOne({ where: { ownerId: interaction.user.id }});
    if (hasTicket) {
        interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor('RED')
                    .setDescription('❌ | Il semblerait que vous ayez déja un salon d\'écoute ouvert ! Veuillez le fermer avant d\'en ouvrir un nouveau.')
            ], ephemeral: true })
    } else {
        let mainGuild = Client.guilds.cache.get(Client.settings.mainGuildID);
        let parent = mainGuild.channels.cache.get(Client.settings.ticketCategoryID);

        // generate unique ID
        let id = await genID();

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('CloseTicket')
                    .setLabel('Fermer l\'écoute')
                    .setEmoji('⚠')
                    .setStyle('DANGER')
            );

        try {
            // send DM confirmation
            await interaction.user.send({ embeds: [
                    new MessageEmbed()
                        .setColor('9bd2d2')
                        .setThumbnail('https://i.imgur.com/haHDKhq.png')
                        .setDescription('👋 | Bonsoir et bienvenue sur Le Trèfle 2.0\nTa demande d\'écoute a bien été prise en compte. Un bénévole écoutant te répondra sous 20 minutes, passé ce délai, nosu t\'invitons à contacter un autre support d\'écoute disponible dans <#718250345951658064>.')
                        .setFooter(`Pour toute réclamation, veuillez fournir l'identifiant unique : ${id}, correspondant à votre écoute.`)
                ], components: [row]});
        } catch (e) {
            if (e) {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setDescription(`
                        ⚠️ | Il semblerait que vos messages privés soient fermés.
                        ⚠️ | Pour les ouvrir uniquement sur le serveur veuillez suivre la procédure :
                        
                        > 🖥️ | Sur ordinateur : vous pouvez faire un clic droit sur le serveur dans la liste, puis vous rendre dans les Paramètres de confidentialité, et autoriser les messages privés des membres du serveur
                        
                       > 📱 | Sur mobile : affichez la liste des salons, puis tout en haut cliquez sur le nom du serveur, et une fois sur le menu activez l'option Autoriser les messages privés`)
                            .setFooter('Si le problème perciste, merci de contacter un membre de l\'association.')
                    ], ephemeral: true
                })
            }
        }

        let ticketChannel = await mainGuild.channels.create(id, {
            topic: 'Salon d\'écoute | ID : '+id,
            parent,
            permissionOverwrites: [
                {
                    id: mainGuild.id,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL]
                }
            ]
        });

        ticketChannel.permissionOverwrites.create(mainGuild.roles.everyone, {
            VIEW_CHANNEL: false
        });

        let text = '';

        let users = await Client.available.findAll();
        for (let i in Object.keys(users)) {
            text += `<@${users[i].userID}>\n`

            let user = await Client.users.fetch(users[i].userID);

            await ticketChannel.permissionOverwrites.create(user, {
                VIEW_CHANNEL: true
            })
        }

        let ticket = await Client.Ticket.create({
            ticketID: id,
            ownerID: interaction.user.id,
            channelID: ticketChannel.id,
        });

        if (text.length < 1) text = null

        interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor('GREEN')
                    .setDescription('✅ | Votre demande d\'écoute a bien été prise en compte, veuillez continuer par messages privés.')
            ], ephemeral: true});

        // send channel msg
        ticketChannel.send({ embeds: [
                new MessageEmbed()
                    .setColor('9bd2d2')
                    .setDescription('🍀 | Nouvelle écoute. Tout message envoyé dans ce salon sera transmi à l\'utilisateur anonyme et inversement.')
            ], components: [row], content: text
        });
    }
}