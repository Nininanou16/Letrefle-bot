const {MessageActionRow, MessageButton, MessageEmbed} = require('discord.js')

module.exports = {
    open: async (client, interaction) => {
        let openRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('OpenTicketSystem')
                    .setLabel('Commencer une permanence')
                    .setStyle('SUCCESS')
                    .setEmoji('🔓')
                    .setDisabled(true),

                new MessageButton()
                    .setCustomId('CloseTicketSystem')
                    .setLabel('Fin de la permancence')
                    .setStyle('DANGER')
                    .setEmoji('🔒')
            )

        client.dashboard.message.edit({ embeds: [
                new MessageEmbed()
                    .setColor('9bd2d2')
                    .setDescription('🔓 | La permanence est actuellement ouverte !')
            ], components: [openRow], content: null});

        client.user.setPresence({
            status: 'online'
        });

        client.user.setActivity('la permanence ouverte !', { type: 'WATCHING'});

        let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('OpenTicket')
                    .setLabel('Ouvrir une écoute')
                    .setEmoji('👋')
                    .setStyle('SUCCESS')
            );


        let mainGuild = await client.guilds.fetch(client.settings.mainGuildID);
        if (mainGuild) {
            let channel = await mainGuild.channels.fetch(client.settings.ticketOpening.channel);
            if (channel) {
                let message = await channel.messages.fetch(client.settings.ticketOpening.message);
                if (message) {
                    message.edit({
                        embeds: [
                            new MessageEmbed()
                                .setColor('9bd2d2')
                                .setDescription('🔓 | La permanence est actuellement ouverte ! Ouvre un salon d\'écoute avec le bouton ci-dessous.')
                        ],
                        components: [row]
                    });
                }
            }
        }

        if (interaction) {
            interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor('9bd2d2')
                    .setDescription('✅ | La permanence a bien été ouverte !')
                ], ephemeral: true})
        }

        let i = 0;

        await client.reOpen.findAll().then(olds => {
            console.log(olds)
            olds.forEach(async old => {
                i++;
                console.log(i);
                console.log(old.timestamp);
                await old.destroy();
            })
        });
    },

    close: async (client, timestamp, interaction) => {
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
            );

        client.dashboard.message.edit({ embeds: [
                new MessageEmbed()
                    .setColor('9bd2d2')
                    .setDescription('🔒 | La permanence est actuellement fermée !')
            ], components: [closedRow], content: null});

        client.user.setPresence({
            status: 'dnd'
        });

        client.user.setActivity('la permanence fermée !', { type: 'WATCHING'});

        let formatTimestamp = timestamp/1000

        let mainGuild = await client.guilds.fetch(client.settings.mainGuildID);
        if (mainGuild) {
            let channel = await mainGuild.channels.fetch(client.settings.ticketOpening.channel);
            if (channel) {
                let message = await channel.messages.fetch(client.settings.ticketOpening.message);
                if (message) {
                    message.edit({
                        embeds: [
                            new MessageEmbed()
                                .setColor('9bd2d2')
                                .setDescription(`🔒 | La permanence est actuellement fermée ! La prochaine permanence aura lieu <t:${formatTimestamp}:R>

                            En cas de soucis urgent, n'hésite pas a te rendre dans <#718250345951658064>`)
                        ],
                        components: []
                    })
                }
            }
        }

        console.log(timestamp)

        setTimeout(() => {
            client.functions.open(client)
        }, timestamp-Date.now());

        if (interaction) {
            interaction.reply({ embeds: [
                new MessageEmbed()
                    .setColor('9bd2d2')
                    .setDescription('✅ | La permanence a bien été fermée !')
                ], ephemeral: true})
        }
    },

    updateAvailable: async (Client, interaction) => {
        let mainGuild = await Client.guilds.fetch(Client.settings.mainGuildID);
        if (mainGuild) {
            let channel = await mainGuild.channels.fetch(Client.settings.available.channelID);
            if (channel) {
                let msg = await channel.messages.fetch(Client.settings.available.messageID);
                if (msg) {
                    let text = '';

                    let users = await Client.available.findAll();
                    for (let i in Object.keys(users)) {
                        text += `<@${users[i].userID}>\n`;
                    }

                    if (text.length < 1) text = "Aucun bénévole disponible !";

                    let row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('StartService')
                                .setEmoji('👋')
                                .setLabel('Rejoindre la permanence')
                                .setStyle('PRIMARY'),

                            new MessageButton()
                                .setCustomId('StopService')
                                .setLabel('Quitter la permanence')
                                .setStyle('SECONDARY')
                        )
                    msg.edit({
                        embeds: [
                            new MessageEmbed()
                                .setColor('9bd2d2')
                                .setDescription(`Bénévoles disponibles :\n\n${text}`)
                        ], components: [row], content: null
                    })
                }
            }
        }
    }
}