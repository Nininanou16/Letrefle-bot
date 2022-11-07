<<<<<<< HEAD
const { EmbedBuilder } = require("discord.js");
=======
const { MessageEmbed } = require("discord.js");
>>>>>>> master

module.exports = async (Client, interaction) => {
  let spec = await Client.spectators.findOne({
    where: { userID: interaction.user.id },
  });
  if (spec) {
    await spec.destroy();

    update(false);
    Client.functions.updateAvailable(Client);

    interaction.reply({
      embeds: [
<<<<<<< HEAD
        new EmbedBuilder()
=======
        new MessageEmbed()
>>>>>>> master
          .setColor("9bd2d2")
          .setDescription(":eyes: | Vous avez bien quitté le mode spectateur"),
      ],
      ephemeral: true,
    });
  } else {
    spec = await Client.spectators.create({
      userID: interaction.user.id,
    });

    update(true);
    Client.functions.updateAvailable(Client);

    interaction.reply({
      embeds: [
<<<<<<< HEAD
        new EmbedBuilder()
=======
        new MessageEmbed()
>>>>>>> master
          .setColor("9bd2d2")
          .setDescription(
            ":eyes: | Vous avez bien rejoint la permanence en tant que spectateur"
          ),
      ],
      ephemeral: true,
    });
  }

  async function update(status) {
    let tickets = await Client.Ticket.findAll();
    for (let i in Object.keys(tickets)) {
<<<<<<< HEAD
      if (tickets[i].attributed !== interaction.user.id) {
=======
      if (!tickets[i].attributed !== interaction.user.id) {
>>>>>>> master
        let guild = Client.guilds.cache.get(Client.settings.mainGuildID);
        if (guild) {
          let channel = await guild.channels.fetch(tickets[i].channelID);
          if (channel) {
            channel.permissionOverwrites.create(interaction.member, {
<<<<<<< HEAD
              ViewChannel: status,
              SendMessages: false,
=======
              VIEW_CHANNEL: status,
              SEND_MESSAGES: false,
>>>>>>> master
            });
          }
        }
      }
    }
  }
};
