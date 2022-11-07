// Importing packages
const Discord = require("discord.js");
const Sequelize = require("sequelize");
const fs = require("fs");
const Client = new Discord.Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_TYPING",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_VOICE_STATES",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_TYPING",
    "DIRECT_MESSAGE_REACTIONS",
  ],
  partials: ["CHANNEL"],
});

// Declaring variables
Client.settings = require("./settings.json");
Client.dashboard = {};
Client.functions = require("./functions");
Client.permamence = null;
Client.db = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  logging: false,
});

// Init collections
Client.commands = new Discord.Collection();
Client.buttons = new Discord.Collection();
Client.menus = new Discord.Collection();

fs.readdir("./Events", (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (file.endsWith(".js")) {
      let event = require(`./Events/${file}`);

      let name = file.split(".")[0];
      Client.on(name, event.bind(null, Client));
    }
  });
});

fs.readdir("./Commands", (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (file.endsWith(".js")) {
      let name = file.split(".")[0];

      let command = require(`./Commands/${file}`);
      command.name = name.toLowerCase();

      Client.commands.set(command.name, command);
    }
  });
});

fs.readdir("./Buttons", (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (file.endsWith(".js")) {
      let name = file.split(".")[0];

      Client.buttons.set(name, require(`./Buttons/${file}`));
    }
  });
});

fs.readdir("./SelectMenus", (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (file.endsWith(".js")) {
      let name = file.split(".")[0];

      Client.menus.set(name, require(`./SelectMenus/${file}`));
    }
  });
});

Client.Report = Client.db.define("report", {
  userID: Sequelize.TEXT,
  reason: Sequelize.TEXT,
  timestamp: Sequelize.NUMBER,
});

// Initiating ticket DB model
Client.Ticket = Client.db.define("ticket", {
  ticketID: Sequelize.TEXT,
  ownerID: Sequelize.TEXT,
  channelID: Sequelize.TEXT,
  attributed: Sequelize.TEXT,
});

// Initiating historic ticket DB model
Client.Historic = Client.db.define("historic", {
  ticketID: Sequelize.TEXT,
});

// Save reopen timestamp
Client.reOpen = Client.db.define("reopen", {
  timestamp: Sequelize.NUMBER,
});

// BE database
Client.available = Client.db.define("available", {
  userID: Sequelize.TEXT,
  occupied: Sequelize.BOOLEAN,
});

Client.open = Client.db.define("open", {
  open: Sequelize.BOOLEAN,
});

Client.spectators = Client.db.define("spectators", {
  userID: Sequelize.TEXT,
});

Client.login(Client.settings.secret_token).then(() => {});
