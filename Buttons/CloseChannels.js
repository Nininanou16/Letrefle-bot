<<<<<<< HEAD
const { EmbedBuilder } = require("discord.js");
=======
const { MessageEmbed } = require("discord.js");
>>>>>>> master

module.exports = async (Client, interaction) => {
  let closing = await Client.functions.updateChannels(Client, false);

  if (closing) {
    interaction.reply({
      content: ":white_check_mark: | Les salons ont été fermés !",
      ephemeral: true,
    });
  }
};
