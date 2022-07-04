const {MessageEmbed, MessageButton, MessageActionRow} = require('discord.js');

module.exports = async (Client, interaction) => {
    interaction.message.delete();

    let closedRow = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('OpenTicketSystem')
                .setLabel('Commencer une permanence')
                .setStyle('SUCCESS')
                .setEmoji('🔓'),

            new MessageButton()
                .setCustomId('CloseTicketSystem')
                .setLabel('Fin de la permancence')
                .setStyle('DANGER')
                .setEmoji('🔒')
                .setDisabled(true)
        )

    Client.dashboard.message.edit({ embeds: [
            new MessageEmbed()
                .setColor('9bd2d2')
                .setDescription('🔒 | La permanence est actuellement fermée !')
        ], components: [closedRow], content: null});

    Client.user.setPresence({
        status: 'dnd'
    });

    Client.user.setActivity('la permanence fermée !', { type: 'WATCHING'});

    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setColor('9bd2d2')
                .setDescription('✅ | La permanence a bien été fermée !')
        ], ephemeral: true
    })

    let mainGuild = await Client.guilds.fetch(Client.settings.mainGuildID);
    if (mainGuild) {
        let channel = await mainGuild.channels.fetch(Client.settings.ticketOpening.channel);
        if (channel) {
            let message = await channel.messages.fetch(Client.settings.ticketOpening.message);
            if (message) {
                message.edit({
                    embeds: [
                        new MessageEmbed()
                            .setColor('9bd2d2')
                            .setDescription('🔒 | La permanence est actuellement fermée ! En cas de problème nous t\'invitons à te rendre dans <#718250345951658064>')
                    ],
                    components: []
                })
            }
        }

        let voiceChannel = await mainGuild.channels.fetch(Client.settings.voiceTicketChannelID);
        if (voiceChannel) {
            voiceChannel.permissionOverwrites.edit(mainGuild.id, {
                VIEW_CHANNEL: false,
                CONNECT: false,
            });
        }
    }
}