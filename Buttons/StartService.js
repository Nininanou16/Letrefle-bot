const {MessageEmbed} = require('discord.js');

module.exports = async (Client, interaction) => {
    let user = interaction.user;

    let userDB = await Client.available.findOne({ where: { userID: user.id }});
    if (userDB) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('9bd2d2')
                    .setDescription('⚠️ | Vous êtes déja disponible !')
            ], ephemeral: true
        });
    } else {
        await Client.available.create({ userID: user.id, occupied: false });
        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('9bd2d2')
                    .setDescription('🍀 | Vous êtes bien disponible !')
            ], ephemeral: true
        });

        let tickets = await Client.Ticket.findAll();
        for (let i in Object.keys(tickets)) {
            let guild = Client.guilds.cache.get(Client.settings.mainGuildID);
            if (guild) {
                let channel = await guild.channels.fetch(tickets[i].channelID);
                if (channel) {
                    channel.permissionOverwrites.create(user, {
                        VIEW_CHANNEL: true
                    });
                }
            }
        }

        Client.functions.updateAvailable(Client)
    }
}