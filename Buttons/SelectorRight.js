<<<<<<< HEAD
const { EmbedBuilder } = require("discord.js");
=======
const { MessageEmbed } = require("discord.js");
>>>>>>> master

module.exports = async (Client, interaction) => {
  let toSelect;
  let i = 0;

  Object.keys(Client.dateSelector.data).forEach((data) => {
    i++;
    if (Client.dateSelector.data[data].selected) {
      toSelect = i + 1;
    }

    Client.dateSelector.data[data].selected = i === toSelect;
  });

  let text = Client.dateSelector.genText();
  interaction.update({
    embeds: [
<<<<<<< HEAD
      new EmbedBuilder().setColor("9bd2d2").setDescription(`
=======
      new MessageEmbed().setColor("9bd2d2").setDescription(`
>>>>>>> master
                        🍀 | Quelle est la date de la prochaine permanence ?
                        
                        ▶️ | ${Client.dateSelector.genText()}`),
    ],
  });
};
