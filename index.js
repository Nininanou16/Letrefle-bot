// Importing packages
const Discord = require('discord.js');
const Sequelize = require('sequelize');
const fs = require('fs');
const Client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_TYPING']});

// Declaring variables
Client.settings = require('./settings.json');
Client.dashboard = {};
Client.functions = require('./functions')
Client.permamence = null;
Client.db = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false
});

// Init collections
Client.commands = new Discord.Collection();
Client.buttons = new Discord.Collection();

fs.readdir('./Events', (err, files) => {
    if (err) throw err

    files.forEach(file => {
        if (file.endsWith('.js')) {
            let event = require(`./Events/${file}`);

            let name = file.split('.')[0];
            Client.on(name, event.bind(null, Client));
        }
    });
});

fs.readdir('./Buttons', (err, files) => {
    if (err) throw err

    files.forEach(file => {
        if (file.endsWith('.js')) {
           let name = file.split('.')[0];

           Client.buttons.set(name, require(`./Buttons/${file}`));
        }
    })
})

// Initiating ticket DB model
Client.Ticket = Client.db.define('ticket', {
    ticketID: Sequelize.TEXT,
    ownerID: Sequelize.TEXT,
    channelID: Sequelize.TEXT,
});

// Initiating historic ticket DB model
Client.Historic = Client.db.define('historic', {
    ticketID: Sequelize.TEXT,
});

// Save reopen timestamp
Client.reOpen = Client.db.define('reopen', {
    timestamp: Sequelize.NUMBER,
});

// BE database
Client.available = Client.db.define('availlable', {
    userID: Sequelize.TEXT,
})

Client.login(Client.settings.secret_token).then(() => {});