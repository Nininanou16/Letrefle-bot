<<<<<<< HEAD
const { EmbedBuilder } = require("discord.js");
=======
const { MessageEmbed } = require("discord.js");
>>>>>>> master

module.exports = async (Client, interaction) => {
  let user = interaction.user;

  let userDB = await Client.available.findOne({ where: { userID: user.id } });
  if (userDB) {
    interaction.reply({
      embeds: [
<<<<<<< HEAD
        new EmbedBuilder()
=======
        new MessageEmbed()
>>>>>>> master
          .setColor("9bd2d2")
          .setDescription("⚠️ | Vous êtes déja disponible !"),
      ],
      ephemeral: true,
    });
  } else {
    await Client.available.create({ userID: user.id, occupied: false });
    interaction.reply({
      embeds: [
<<<<<<< HEAD
        new EmbedBuilder()
=======
        new MessageEmbed()
>>>>>>> master
          .setColor("9bd2d2")
          .setDescription("🍀 | Vous êtes bien disponible !"),
      ],
      ephemeral: true,
    });

    Client.functions.updateAvailable(Client);
  }
};
