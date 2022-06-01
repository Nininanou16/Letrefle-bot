const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const bcrypt = require('bcrypt');

module.exports = async (Client, interaction) => {
    let users = [];

    for (let i of interaction.values) {
        let user = await Client.users.fetch(i);
        if (user) users.push(user);
    }

    let ticket = await Client.Ticket.findOne({ where: { channelID: interaction.message.channel.id }});

    if (ticket) {
        let text = '';
        let ticketChannel = await interaction.message.channel

        let ids = []

        for (let i of users) {
            text += `<@${i.id}> `;
            ids.push(i.id)

            let userDB = await Client.available.findOne({ where: { userID: i.id }});
            await userDB.update({
                userID: i.id,
                occupied: true,
            })

            console.log(Client.users.cache.get(i.id))

            ticketChannel.permissionOverwrites.create(Client.users.cache.get(i.id), {
                VIEW_CHANNEL: true
            });
        }

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('CloseTicket')
                    .setLabel('Fermer l\'écoute')
                    .setEmoji('⚠')
                    .setStyle('DANGER'),

                new MessageButton()
                    .setCustomId('ReportTicket')
                    .setLabel('Vigilance')
                    .setEmoji('🔴')
                    .setStyle('SECONDARY'),

                new MessageButton()
                    .setCustomId('AnonyLift')
                    .setLabel('Levée d\'identifiant')
                    .setEmoji('🆔')
                    .setStyle('SECONDARY')
            )

        ticketChannel.bulkDelete(100);

        let warningEmbed = null;
        let warnings = await Client.Report.findAll();
        let txt = '';

        for (let i of Object.values(warnings)) {
            await bcrypt.compare(ticket.ownerID, i.userID, (err, result) => {
                if (err) return console.log(err);
                if (result) {
                    ticketChannel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor('#d36515')
                                .setDescription(`:warning: | Vigilance signalée :\n<t:${Math.round(i.timestamp/1000)}:R> - ${i.reason}`)
                        ]
                    });
                }
            });
        }

        ticketChannel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('9bd2d2')
                    .setDescription(`💬 | Cette écoute est maintenant attribuée, tout message envoyé dans ce salon sera transmi à l'utilisateur.${txt.length > 1 ? `\n\nL'utilisateur à déja été signalé pour les motifs suivants :\n${txt}` : ``}`)
            ], components: [row], content: text
        });

        await ticket.update({
            ticketID: ticket.ticketID,
            ownerID: ticket.ownerID,
            channelID: ticket.channelID,
            attributed: ids
        });

        Client.functions.updateAvailable(Client);

        // let available = new Client.available({})
    }
}