const {MessageEmbed} = require('discord.js')

module.exports = async (Client, oldState, newState) => {
    // console.log('update')
    // if (!oldState.channel) Client.emit('voiceChannelJoin', (newState));
    // if (!newState.channel) Client.emit('voiceChannelLeave', (oldState));
    // if (newState.channel && oldState.channel && oldState.channel !== newState.channel) Client.emit()

    if (newState.channelId === Client.settings.voiceTicketChannelID) {
        let ticket = await Client.Ticket.findOne({ where: { ownerID: newState.member.user.id }});

        if (ticket) {
            let vc = await newState.member.guild.channels.create(ticket.ticketID, {
                type: 'GUILD_VOICE',
                parent: Client.settings.ticketCategoryID,
                permissionOverwrites: [
                    {
                        id: newState.member.guild.id,
                        deny: ['VIEW_CHANNEL']
                    },
                    {
                        id: newState.member.user.id,
                        allow: ['CONNECT']
                    }
                ]
            });

            if (vc) {
                await newState.setChannel(vc);

                ticket.attributed = JSON.parse(ticket.attributed);
                ticket.attributed.push(ticket.ownerID);

                for (let i of ticket.attributed) {
                    let user = Client.users.cache.get(i);
                    vc.permissionOverwrites.create(user, {
                        VIEW_CHANNEL: true,
                        CONNECT: true
                    })
                }
            }
        } else {
            newState.disconnect();
            newState.member.user.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('9bd2d2')
                        .setDescription(`<:letrefle:881678451608788993> | Avant d'ouvrir une écoute vocale, merci d'ouvrir une écoute via le bouton ":wave: Ouvrir une écoute" dans le salon <#${Client.settings.ticketOpening.channel}>, et de demander au bénévole d'effectuer l'écoute de manière orale. Il se peut qu'une écoute orale soit impossible pour certaines conditions techniques.\n\n:warning: Les écoutes vocales ne peuvent, pour des raisons techniques, pas actuellement être proposée de manière anonyme.`)
                ]
            })
        }
    }

    if (oldState.channel?.parentId === Client.settings.ticketCategoryID && newState.channel?.parentId !== Client.settings.ticketCategoryID && (!oldState.channel.members || oldState.channel.members.size < 1)) {
        let ticket = await Client.Ticket.findOne({ where: { ticketID: oldState.channel.name }});
        if (ticket) {
            oldState.channel.delete();
        }
    }
}