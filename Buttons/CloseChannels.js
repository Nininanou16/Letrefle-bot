module.exports = async (Client, interaction) => {
    let guild = await Client.guilds.fetch(Client.settings.mainGuildID);
    if (guild) {

        let opened = await Client.open.findAll()

        for (let i of opened) {
            await i.destroy();
        }

        await Client.open.create({
            open: false
        });

        for (let i in Client.settings.toClose) {
            let channel = await guild.channels.fetch(i);
            if (channel) {
                let role = await guild.roles.fetch(Client.settings.toCloseRole);
                if (role) {
                    switch (channel.type) {
                        case 'GUILD_TEXT':
                            channel.permissionOverwrites.create(guild.id, {
                                SEND_MESSAGES: false
                            });
                            break;

                        case 'GUILD_VOICE':
                            channel.permissionOverwrites.create(guild.id, {
                                CONNECT: false
                            });
                            break;
                    }
                }

            }
        }

        Client.functions.updateChannelsMessage(Client);

        interaction.reply({
            content: ':white_check_mark: | Les salons ont été fermés !', ephemeral: true
        })


    }
}