const {MessageActionRow, MessageButton, MessageEmbed} = require('discord.js')

module.exports = async (Client, message) => {
    if (message.author.bot) return;

    if (Client.settings.setupMode && message.mentions.users.first().id === Client.user.id) {
        let msg = await message.channel.send('Configuration...');
        msg.edit({
            embeds: [
                new MessageEmbed()
                    .setColor('9bd2d2')
                    .setDescription(`ChannelID: ${message.channel.id}\nMessageID: ${msg.id}`)
            ], content: null
        });
    }

    // handle DM messages redirection
    if (message.channel.type === 'DM') {
        let ticket = await Client.Ticket.findOne({ where: { ownerID: message.author.id }});

        if (ticket) {
            let mainGuild = Client.guilds.cache.get(Client.settings.mainGuildID);
            if (mainGuild) {
                let ticketChannel = await mainGuild.channels.fetch(ticket.channelID)
                if (ticketChannel) {
                    let embed = new MessageEmbed()
                        .setAuthor('Utilisateur', 'https://cdn.discordapp.com/attachments/757897064754708560/883734125985529866/default-profile-picture-clipart-3.jpg')
                        .setDescription(message.content)
                        .setTimestamp()
                        .setColor('9bd2d2');

                    if (message.attachments.size >= 1) {
                        message.attachments.forEach(attachment => {
                            if (attachment.name.endsWith('.jpg') ||
                                attachment.name.endsWith('.jpeg') ||
                                attachment.name.endsWith('.png') ||
                                attachment.name.endsWith('.gif')) {
                                embed.setImage(attachment.url);
                            }
                        })
                    }

                    if (message.reference) {
                        let replyMsg = await message.channel.messages.fetch(message.reference.messageId);
                        if (replyMsg) {
                            // check if replyMsg is partial and if yes fetch it in the channel with the id
                            if (replyMsg.partial) {
                                replyMsg = await message.channel.messages.fetch(message.reference.messageId);
                            }
                            let content = replyMsg?.embeds[0]?.description;
                            if (content) {
                                let msgToReply = ticketChannel.messages.cache.find(msg => msg.content === content);
                                if (msgToReply) {
                                    return msgToReply.reply({embeds: [embed]});
                                }
                            } else {
                                ticketChannel.send({ embeds: [embed]});
                            }
                        }
                    }

                    ticketChannel.send({ embeds: [ embed ]});
                }
            }
        } else {
            let embed = new MessageEmbed()
                .setColor('9bd2d2')
                .setThumbnail(Client.user.avatarURL())

            let row = new MessageActionRow()

            let open = await Client.open.findOne();
            if (open.open) {
                row.addComponents(
                    new MessageButton()
                        .setStyle('PRIMARY')
                        .setDisabled(false)
                        .setEmoji('👋')
                        .setLabel('Ouvrir une écoute')
                        .setCustomId('OpenTicket')
                );

                embed.setDescription(`Bienvenue sur Le Trèfle 2.0 !\n\nVous pouvez dès maintenant ouvrir une écoute à l'aide du bouton ci-dessous.\n`)
            } else {
                row.addComponents(
                    new MessageButton()
                        .setStyle('PRIMARY')
                        .setDisabled(true)
                        .setEmoji('👋')
                        .setLabel('Ouvrir une écoute')
                        .setCustomId('OpenTicket')
                );
            }

            row.addComponents(
                new MessageButton()
                    .setStyle('SECONDARY')
                    .setURL('https://letrefle.org')
                    .setLabel('Consulter notre site'),

                new MessageButton()
                    .setStyle('SECONDARY')
                    .setURL('https://discord.gg/letrefle')
                    .setLabel('Rejoindre notre serveur discord')
            );


        }
    }

    // handle server channel message redirection
    let ticket = await Client.Ticket.findOne({ where: { channelID: message.channel.id }});
    if (ticket) {
        let user = await Client.users.fetch(ticket.ownerID);
        if (user) {
            let embed = new MessageEmbed()
                .setAuthor('Bénévole écoutant', 'https://cdn.discordapp.com/attachments/757897064754708560/883734125985529866/default-profile-picture-clipart-3.jpg')
                .setDescription(message.content)
                .setFooter(`Écoute ID : ${ticket.ticketID}`)
                .setColor('9bd2d2')
                .setTimestamp();

            if (message.attachments.size >= 1) {
                message.attachments.forEach(attachment => {
                    if (attachment.name.endsWith('.jpg') ||
                    attachment.name.endsWith('.jpeg') ||
                    attachment.name.endsWith('.png') ||
                    attachment.name.endsWith('.gif')) {
                        embed.setImage(attachment.url);
                    }
                })
            }

            if (message.reference) {
                let replyMsg = await message.channel.messages.fetch(message.reference.messageId);
                if (replyMsg) {
                    let content = replyMsg?.embeds[0]?.description;
                    if (content) {
                        let msgToReply = user.dmChannel.messages.cache.find(msg => msg.content === content);
                        if (msgToReply) {
                            return msgToReply.reply({embeds: [embed]});
                        }
                    } else {
                        user.dmChannel.send({ embeds: [embed]});
                    }
                }
            }

            user.send({ embeds: [ embed ]});
        }
    }
}