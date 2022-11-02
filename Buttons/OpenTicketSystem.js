const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = async (Client, interaction) => {
  Client.functions.open(Client, interaction);
};
