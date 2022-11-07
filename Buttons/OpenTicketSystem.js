<<<<<<< HEAD
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");
=======
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
>>>>>>> master

module.exports = async (Client, interaction) => {
  Client.functions.open(Client, interaction);
};
