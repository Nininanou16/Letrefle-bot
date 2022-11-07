<<<<<<< HEAD
const { EmbedBuilder } = require("discord.js");
=======
const { MessageEmbed } = require("discord.js");
>>>>>>> master

module.exports = async (Client, oldState, newState) => {
  if (newState.channelId === Client.settings.voiceTicketChannelID) {
    let ticket = await Client.Ticket.findOne({
      where: { ownerID: newState.member.user.id },
    });

    if (ticket) {
      let vc = await newState.member.guild.channels.create(ticket.ticketID, {
        type: "GUILD_VOICE",
        parent: Client.settings.ticketCategoryID,
        permissionOverwrites: [
          {
            id: newState.member.guild.id,
<<<<<<< HEAD
            deny: ["ViewChannel"],
=======
            deny: ["VIEW_CHANNEL"],
>>>>>>> master
          },
          {
            id: newState.member.user.id,
            allow: ["CONNECT"],
          },
        ],
      });

      if (vc) {
        await newState.setChannel(vc);

        let attributed = Client.users.cache.get(ticket.attributed);
        if (attributed) {
          vc.permissionOverwrites.create(attributed, {
<<<<<<< HEAD
            ViewChannel: true,
=======
            VIEW_CHANNEL: true,
>>>>>>> master
            CONNECT: true,
          });
        }

        let referentRole = await vc.guild.roles.fetch(
          Client.settings.referentRoleID
        );
        if (referentRole) {
          vc.permissionOverwrites.create(referentRole, {
<<<<<<< HEAD
            ViewChannel: true,
=======
            VIEW_CHANNEL: true,
>>>>>>> master
            CONNECT: true,
          });
        }
      }
    } else {
      newState.disconnect();
      newState.member.user.send({
        embeds: [
<<<<<<< HEAD
          new EmbedBuilder()
=======
          new MessageEmbed()
>>>>>>> master
            .setColor("9bd2d2")
            .setDescription(
              `<:letrefle:881678451608788993> | Avant d'ouvrir une écoute vocale, merci d'ouvrir une écoute via le bouton ":wave: Ouvrir une écoute" dans le salon <#${Client.settings.ticketOpening.channel}>, et de demander au bénévole d'effectuer l'écoute de manière orale. Il se peut qu'une écoute orale soit impossible pour certaines conditions techniques.\n\n:warning: Les écoutes vocales ne peuvent, pour des raisons techniques, pas actuellement être proposée de manière anonyme.`
            ),
        ],
      });
    }
  }

  if (
    oldState.channel?.parentId === Client.settings.ticketCategoryID &&
    newState.channel?.parentId !== Client.settings.ticketCategoryID &&
    (!oldState.channel.members || oldState.channel.members.size < 1)
  ) {
    let ticket = await Client.Ticket.findOne({
      where: { ticketID: oldState.channel.name },
    });
    if (ticket) {
      oldState.channel.delete();
    }
  }
};
