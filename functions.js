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

            let vc = await mainGuild.channels.fetch(client.settings.voiceTicketChannelID);
            if (vc) {
                vc.permissionOverwrites.create(mainGuild.id, {
                    CONNECT: true
                });
            }

            let announcementChannel = await mainGuild.channels.fetch(client.settings.toCloseMessageChannel);
            if (announcementChannel) {
                announcementChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(`<#${client.settings.ticketOpening.channel}>`)
                            .setImage('https://i.imgur.com/1ApEpoi.png')
                            .setColor('9bd2d2')
                    ]
                })
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
            olds.forEach(async old => {
                i++;
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

                            En cas de soucis urgent, n'hésite pas à te rendre dans <#718250345951658064>`)
                        ],
                        components: []
                    })
                }
            }

            let vc = await mainGuild.channels.fetch(client.settings.voiceTicketChannelID);
            if (vc) {
                vc.permissionOverwrites.create(mainGuild.id, {
                    CONNECT: false
                });
            }
        }

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

    updateAvailable: async (Client) => {
        let mainGuild = await Client.guilds.fetch(Client.settings.mainGuildID);
        if (mainGuild) {
            let channel = await mainGuild.channels.fetch(Client.settings.available.channelID);
            if (channel) {
                let msg = await channel.messages.fetch(Client.settings.available.messageID);
                if (msg) {
                    let text = '';

                    let users = await Client.available.findAll();
                    for (let i in Object.keys(users)) {
                        text += `${users[i].occupied ? '🔴' : '🟢'} <@${users[i].userID}>\n`;
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
    },

    updateChannelsMessage: async (Client) => {
        let guild = await Client.guilds.fetch(Client.settings.mainGuildID);
        if (guild) {
            let channel = await guild.channels.fetch(Client.settings.channels.channelID);
            if (channel) {
                let message = await channel.messages.fetch(Client.settings.channels.messageID);
                if (message) {
                    let opened = await Client.open.findAll()
                    opened = opened[0];
                    if (!opened) opened = {
                        open: true
                    }

                    let row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('OpenChannels')
                                .setStyle('SUCCESS')
                                .setEmoji('🔓')
                                .setLabel('Ouvrir les salons')
                                .setDisabled(opened.open),

                            new MessageButton()
                                .setCustomId('CloseChannels')
                                .setStyle('SECONDARY')
                                .setEmoji('🔒')
                                .setLabel('Fermer les salons')
                                .setDisabled(!opened.open)
                        );

                    message.edit({
                        embeds: [
                            new MessageEmbed()
                                .setColor('9bd2d2')
                                .setDescription(opened.open ? '🔓 | Salons ouverts' : '🔒 | Salons fermés')
                        ], components: [row]
                    });
                }
            }
        }
    },

    updateChannels: async (Client, open) => {
        console.log(open ? 'Open channels' : 'Close channels')
        let guild = await Client.guilds.fetch(Client.settings.mainGuildID);
        if (guild) {
            let opened = await Client.open.findAll()

            for (let i of opened) {
                // if (i.open === open) return false;
                await i.destroy();
            }

            await Client.open.create({
                open: open
            });

            for (let i of Object.keys(Client.settings.toClose)) {
                let role = await guild.roles.fetch(i);
                if (role) {
                    for (let id of Client.settings.toClose[i]) {
                        let channel = await guild.channels.fetch(id);
                        if (channel) {
                            switch (channel.type) {
                                case 'GUILD_TEXT':
                                    channel.permissionOverwrites.edit(role, {
                                        SEND_MESSAGES: open
                                    });
                                    break;

                                case 'GUILD_VOICE':
                                    channel.permissionOverwrites.edit(role, {
                                        CONNECT: open
                                    })
                            }
                        }
                    }
                }
            }

            let openEmbed = new MessageEmbed()
                .setColor('9bd2d2')
                .setDescription('<:onn:895691557817180191>  __**Bonjour à toutes et à tous, les canaux vocaux et textuels sont ouvert**__.  <:onn:895691557817180191>\n' +
                    ':sunny: *Nous comptons sur vous pour avoir des échanges et des propos corrects.* :sunny:')
                .setImage('https://cdn.discordapp.com/attachments/718248830428119121/895901124404584488/Le_petit_bonjour_du_matin.png');

            let closeEmbed = new MessageEmbed()
                .setColor('9bd2d2')
                .setDescription('__**<:off:895691615593705512>  Fermeture des canaux textuels et vocaux. <:off:895691615593705512>**\n' +
                    '*L\'équipe vous souhaites une très belle nuit. A demain.*__\n' +
                    '--\n' +
                    ':last_quarter_moon_with_face:**__POURQUOI ON FERME LES CANAUX LA NUIT__** :\n *En tant qu\'association reconnue d\'action sociale, nous avons la responsabilité de ce qui se passe sur notre discord. Quand l\'association sera plus développée, nous pourrons vous proposer des horaires un peu plus tardifs dans des canaux publics, mais il est aussi question de vous préserver au niveau sommeil. Oui, vous pouvez aller sur un autre serveur, mais nous nous devons de ne pas participer à cela.*:first_quarter_moon_with_face:\n' +
                    '\n' +
                    'PS: Si cette nuit tu ne vas pas bien n\'hésites pas à te rendre ici : <#718250345951658064>')
                .setImage('https://cdn.discordapp.com/attachments/718248830428119121/895777777905729577/Le_bonsoir-1.png')

            let mainChannel = await guild.channels.fetch(Client.settings.toCloseMessageChannel);
            if (mainChannel) {
                let msg = await mainChannel.send({
                    embeds: [
                        (open ? openEmbed : closeEmbed),
                    ]
                });

                if (!open) {
                    for (let i of Client.settings.toCloseEmojis) {
                        let emoji = await Client.emojis.cache.get(i);
                        if (emoji) {
                            msg.react(emoji);
                        }
                    }
                }
            }

            Client.functions.updateChannelsMessage(Client);

            return true;
        } else return false;
    }
}