module.exports = async (Client, type) => {
    if (!type.user.bot) {
        switch (type.channel.type) {
            case 'GUILD_TEXT':
                let guildTicket = await Client.Ticket.findOne({ where: { channelID: type.channel.id }});
                if (guildTicket) {
                    let user = Client.users.cache.get(guildTicket.ownerID);
                    if (user) {
                        try {
                            user.dmChannel.sendTyping();
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
                break;

            case 'DM':
                let ticket = await Client.Ticket.findOne({ where: { ownerID: type.user.id }});
                if (ticket) {
                    let mainGuild = await Client.guilds.fetch(Client.settings.mainGuildID);
                    if (mainGuild) {
                        let channel = await mainGuild.channels.fetch(ticket.channelID);
                        if (channel) {
                            try {
                                channel.sendTyping();
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                }
                break;
        }
    }
}