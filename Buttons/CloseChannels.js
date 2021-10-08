const {MessageEmbed} = require('discord.js');

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
            let channel = await guild.channels.fetch(Client.settings.toClose[i]);
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

        let mainChannel = await guild.channels.fetch(Client.settings.toCloseMessageChannel);
        if (mainChannel) {
            mainChannel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('9bd2d2')
                        .setDescription('__**<:off:895691615593705512>  Fermeture des canaux textuels et vocaux. <:off:895691615593705512>**\n' +
                            '*L\'équipe vous souhaites une très belle nuit. A demain.*__\n' +
                            '--\n' +
                            ':last_quarter_moon_with_face:**__POURQUOI ON FERME LES CANAUX LA NUIT__** :\n *En tant qu\'association reconnue d\'action sociale, nous avons la responsabilité de ce qui se passe sur notre discord. Quand l\'association sera plus développée, nous pourrons vous proposer des horaires un peu plus tardifs dans des canaux publics, mais il est aussi question de vous préserver au niveau sommeil. Oui, vous pouvez aller sur un autre serveur, mais nous nous devons de ne pas participer à cela.*:first_quarter_moon_with_face:\n' +
                            '\n' +
                            'PS: Si cette nuit tu ne vas pas bien n\'hésites pas à te rendre ici : <#718250345951658064>')
                        .setImage('https://cdn.discordapp.com/attachments/718248830428119121/895777777905729577/Le_bonsoir-1.png')
                ], content: `<@&${Client.settings.toCloseMessageMentionRole}>`
            })
        }

        Client.functions.updateChannelsMessage(Client);

        interaction.reply({
            content: ':white_check_mark: | Les salons ont été fermés !', ephemeral: true
        })


    }
}