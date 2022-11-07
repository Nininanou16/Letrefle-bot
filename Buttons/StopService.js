<<<<<<< HEAD
const { EmbedBuilder } = require("discord.js");
=======
const { MessageEmbed } = require("discord.js");
>>>>>>> master

module.exports = async (Client, interaction) => {
  let user = interaction.user;

  let userDB = await Client.available.findOne({ where: { userID: user.id } });
  if (userDB) {
    await userDB.destroy();

    interaction.reply({
      embeds: [
<<<<<<< HEAD
        new EmbedBuilder()
=======
        new MessageEmbed()
>>>>>>> master
          .setColor("9bd2d2")
          .setDescription("🍀 | Vous n'êtes plus disponible !"),
      ],
      ephemeral: true,
    });

    let tickets = await Client.Ticket.findAll();
    for (let i in Object.keys(tickets)) {
      let guild = Client.guilds.cache.get(Client.settings.mainGuildID);
      if (guild) {
        let channel = await guild.channels.fetch(tickets[i].channelID);
        if (channel) {
          channel.permissionOverwrites.create(user, {
<<<<<<< HEAD
            ViewChannel: false,
=======
            VIEW_CHANNEL: false,
>>>>>>> master
          });
        }
      }
    }

    Client.functions.updateAvailable(Client);
  } else {
    interaction.reply({
      embeds: [
<<<<<<< HEAD
        new EmbedBuilder()
=======
        new MessageEmbed()
>>>>>>> master
          .setColor("9bd2d2")
          .setDescription("⚠️ | Vous n'êtes actuellement pas disponible !"),
      ],
      ephemeral: true,
    });
  }
};
