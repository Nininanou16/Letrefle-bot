const {MessageEmbed} = require('discord.js')

module.exports = async (Client, interaction) => {
    let guild = await Client.guilds.fetch(Client.settings.mainGuildID);
    if (guild) {

        let opened = await Client.open.findAll()

        for (let i of opened) {
            await i.destroy();
        }

        await Client.open.create({
            open: true
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
                                    SEND_MESSAGES: true
                                });
                                break;

                            case 'GUILD_VOICE':
                                channel.permissionOverwrites.edit(role, {
                                    CONNECT: true
                                })
                        }
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
                        .setDescription('<:onn:895691557817180191>  __**Bonjour à toutes et à tous, les canaux vocaux et textuels sont ouvert**__.  <:onn:895691557817180191>\n' +
                            ':sunny: *Nous comptons sur vous pour avoir des échanges et des propos corrects.* :sunny:')
                        .setImage('https://cdn.discordapp.com/attachments/718248830428119121/895901124404584488/Le_petit_bonjour_du_matin.png')
                ]
            })
        }

        Client.functions.updateChannelsMessage(Client);

        interaction.reply({
            content: ':white_check_mark: | Les salons ont été ouverts !', ephemeral: true
        });


    }
}