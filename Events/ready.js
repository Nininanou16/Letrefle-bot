const colors = require('colors');
const {scheduleJob} = require('node-schedule')

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

        let opened = await Client.open.findAll();
        let planned = {
            monday: {
                open: false,
                close: false,
            },
            tuesday: {
                open: false,
                close: false,
            },
            wednesday: {
                open: false,
                close: false,
            },
            thursday: {
                open: false,
                close: false,
            },
            friday: {
                open: false,
                close: false,
            },
            saturday: {
                open: false,
                close: false,
            },
            sunday: {
                open: false,
                close: false,
            }
        }

        let times = Client.settings.toCloseTime

        for (let i in Object.keys(times)) {
            switch (i) {
                case 'monday':
                    if (times.monday.open) {
                        for (let i of times.monday.open) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 1`, () => Client.functions.updateChannels(Client, true));
                        }

                        planned.monday.open = true;
                    }

                    if (times.monday.close) {
                        for (let i of times.monday.close) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 1`, () => Client.functions.updateChannels(Client, false));
                        }

                        planned.monday.close = true;
                    }
                    break;

                case 'tuesday':
                    if (times.tuesday.open) {
                        for (let i of times.tuesday.open) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 2`, () => Client.functions.updateChannels(Client, true));
                        }

                        planned.tuesday.open = true;
                    }

                    if (times.tuesday.close) {
                        for (let i of times.tuesday.close) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 2`, () => Client.functions.updateChannels(Client, false));
                        }

                        planned.tuesday.close = true;
                    }
                    break;

                case 'wednesday':
                    if (times.wednesday.open) {
                        for (let i of times.wednesday.open) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 3`, () => Client.functions.updateChannels(Client, true));
                        }

                        planned.wednesday.open = true;
                    }

                    if (times.wednesday.close) {
                        for (let i of times.wednesday.close) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 3`, () => Client.functions.updateChannels(Client, false));
                        }

                        planned.wednesday.close = true;
                    }
                    break;

                case 'thursday':
                    if (times.thursday.open) {
                        for (let i of times.thursday.open) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 4`, () => Client.functions.updateChannels(Client, true));
                        }

                        planned.thursday.open = true;
                    }

                    if (times.thursday.close) {
                        for (let i of times.thursday.close) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 4`, () => Client.functions.updateChannels(Client, false));
                        }

                        planned.thursday.close = true;
                    }
                    break;

                case 'friday':
                    if (times.friday.open) {
                        for (let i of times.friday.open) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 5`, () => Client.functions.updateChannels(Client, true));
                        }

                        planned.friday.open = true;
                    }

                    if (times.friday.close) {
                        for (let i of times.friday.close) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 5`, () => Client.functions.updateChannels(Client, false));
                        }

                        planned.friday.close = true;
                    }
                    break;

                case 'saturday':
                    if (times.saturday.open) {
                        for (let i of times.saturday.open) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 6`, () => Client.functions.updateChannels(Client, true));
                        }

                        planned.saturday.open = true;
                    }

                    if (times.saturday.close) {
                        for (let i of times.saturday.close) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 6`, () => Client.functions.updateChannels(Client, false));
                        }

                        planned.saturday.close = true;
                    }
                    break;

                case 'sunday':
                    if (times.sunday.open) {
                        for (let i of times.sunday.open) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 7`, () => Client.functions.updateChannels(Client, true));
                        }

                        planned.sunday.open = true;
                    }

                    if (times.sunday.close) {
                        for (let i of times.sunday.close) {
                            scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * 7`, Client.functions.updateChannels(Client, false));
                        }

                        planned.sunday.close = true;
                    }
                    break;

                default:
                    let count = 0;
                    for (let i2 of Object.keys(planned)) {
                        count++
                        let day = planned[i2];
                        if (!day.open) {
                            if (times.default.open) {
                                for (let i of times.default.open) {
                                    scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * ${count}`, () => {
                                        Client.functions.updateChannels(Client, true)
                                    });
                                }
                            }

                            planned[i2].open = true;
                        }

                        if (!day.close) {
                            if (times.default.close) {
                                for (let i of times.default.close) {
                                    scheduleJob(`${i.split('h')[1]} ${i.split('h')[0]} * * ${count}`, () => {
                                        Client.functions.updateChannels(Client, false)
                                    });
                                }
                            }

                            planned[i2].close = true
                        }
                    }
                    break;
            }
        }


        for (let i of opened) {
            await i.destroy();
        }

        await Client.open.create({
            open: true
        });
    }
}