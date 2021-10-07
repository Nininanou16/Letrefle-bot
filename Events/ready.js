const colors = require('colors');

module.exports = async (Client) => {
    await Client.Ticket.sync();
    await Client.Historic.sync();
    await Client.reOpen.sync();
    await Client.available.sync();
    await Client.open.sync();

    console.log(('─────────────────────────────────\n' +
        '────────▄███▄───────▄███▄────────\n' +
        '───────███████─────███████───────\n' +
        '──────█████████───█████████──────\n' +
        '────▄███████████─███████████▄────\n' +
        '──▄█████████████─█████████████▄──\n' +
        '▄███████████████─███████████████▄\n' +
        '████████████████─████████████████\n' +
        '████████████████─████████████████ \n' +
        '▀███████████████████████████████▀     ##       ######## ######## ########  ######## ######## ##       ########  #######        ##### \n' +
        '──▀███████████████████████████▀──     ##       ##          ##    ##     ## ##       ##       ##       ##       ##     ##      ##   ## \n' +
        '────▀███████████████████████▀────     ##       ##          ##    ##     ## ##       ##       ##       ##              ##     ##     ## \n' +
        '──────────▀███████████▀──────────     ##       ######      ##    ########  ######   ######   ##       ######    #######      ##     ##\n' +
        '────▄████████████████████████▄───     ##       ##          ##    ##   ##   ##       ##       ##       ##       ##            ##     ## \n' +
        '─▄█████████████████████████████▄─     ##       ##          ##    ##    ##  ##       ##       ##       ##       ##        ###  ##   ##\n' +
        '█████████████████████████████████     ######## ########    ##    ##     ## ######## ##       ######## ######## ######### ###   ##### \n' +
        '█████████████████████████████████\n' +
        '███████████████─██─██████████████\n' +
        '███████████████─██─██████████████\n' +
        '─██████████████─██─████████████▀─\n' +
        '──▀████████████─██─██████████▀───\n' +
        '────▀█████████──██──████████▀────\n' +
        '──────███████───██───██████▀─────\n' +
        '───────▀███▀────███───▀███▀──────\n' +
        '─────────────────███─────────────\n' +
        '──────────────────███────────────\n' +
        '───────────────────███───────────').green);

    Client.functions.updateAvailable(Client);
    Client.functions.updateChannelsMessage(Client);

    let mainGuild = Client.guilds.cache.get(Client.settings.mainGuildID);
    if (mainGuild) {
        let mainChannel = mainGuild.channels.cache.get(Client.settings.dashboard.channelID);
        if (mainChannel) {
            Client.dashboard.channel = mainChannel;
            let managingMessage = await mainChannel.messages.fetch(Client.settings.dashboard.messageID);
            if (managingMessage) {
                Client.dashboard.message = managingMessage;
            }

            let i = 0;

            let reopen = await Client.reOpen.findAll();
            let timestamp = 0;
            if (reopen) {
                reopen.every(time => {
                    i++
                    if ((time.timestamp) > timestamp) timestamp = time.timestamp
                })
            }

            let currTimestamp = Date.now();

            switch (timestamp < currTimestamp) {
                case true:
                    Client.functions.open(Client)
                    break;

                case false:
                    Client.functions.close(Client, timestamp)
                    break;
            }
        }
    }
}