const {MessageActionRow, MessageButton, MessageEmbed} = require('discord.js')

module.exports = async (Client, message) => {
    if (message.author.bot) return;

    if (message.mentions.users.first().id === Client.user.id && Client.settings.setupMode) {
        let msg = await message.channel.send('Configuration...');
        msg.edit({
            embeds: [
                new MessageEmbed()
                    .setColor('9bd2d2')
                    .setDescription(`ChannelID: ${message.channel.id}\nMessageID: ${msg.id}`)
            ]
        });
    }
    // if (message.content === 'ticket') {
    //     let row = new MessageActionRow()
    //         .addComponents(
    //             new MessageButton()
    //                 .setCustomId('OpenTicket')
    //                 .setLabel('Ouvrir une écoute')
    //                 .setEmoji('👋')
    //                 .setStyle('SUCCESS')
    //         );
    //
    //     let embed = new MessageEmbed()
    //         .setColor('9bd2d2')
    //         .setDescription('[ticket open message]');
    //
    //     message.channel.send({ embeds: [embed], components: [row]});
    // }

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
                            console.log(attachment.name.endsWith('.gif'))
                            if (attachment.name.endsWith('.jpg') ||
                                attachment.name.endsWith('.jpeg') ||
                                attachment.name.endsWith('.png') ||
                                attachment.name.endsWith('.gif')) {
                                embed.setImage(attachment.url);
                            }
                        })
                    };

                    ticketChannel.send({ embeds: [ embed ]});
                } else console.log('no ticket')
            } else console.log('no guild')
        } else console.log('no ticket')
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
                    console.log(attachment.name.endsWith('.gif'))
                    if (attachment.name.endsWith('.jpg') ||
                    attachment.name.endsWith('.jpeg') ||
                    attachment.name.endsWith('.png') ||
                    attachment.name.endsWith('.gif')) {
                        embed.setImage(attachment.url);
                    }
                })
            };

            user.send({ embeds: [ embed ]});
        }
    }
}