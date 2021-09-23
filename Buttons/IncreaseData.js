const {MessageEmbed} = require('discord.js');

module.exports = async (Client, interaction) => {
    let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    Object.keys(Client.dateSelector.data).forEach(data => {
        if (Client.dateSelector.data[data].selected) {
            let value = Client.dateSelector.data[data].value;
            let numValue = parseInt(value)
            switch (data) {
                case 'day':
                    console.log('day')
                    console.log(months[parseInt(Client.dateSelector.data.month.value)-1])
                    console.log(months)
                    if (numValue >= months[parseInt(Client.dateSelector.data.month.value)-1]) {
                        Client.dateSelector.data[data].value = '01';

                    }
                    break;

                case 'month':
                    if (numValue >= 12) return Client.dateSelector.data[data].value = '01';
                    break;

                case 'hour':
                    if (numValue >= 23) return Client.dateSelector.data[data].value = '00';
                    break;

                case 'minute':
                    if (numValue >= 55) return Client.dateSelector.data[data].value = '00';
            }
            if (data === 'minute') value = (parseInt(value)+5).toString();
            else value = (parseInt(value)+1).toString();
            if (value.length < 2) {
                value = `0${value}`;
            }

            Client.dateSelector.data[data].value = value;
        }
    });

    interaction.update({
        embeds: [
            new MessageEmbed()
                .setColor('9bd2d2')
                .setDescription(`
                        🍀 | Quelle est la date de la prochaine permanence ?
                        
                        ▶️ | ${Client.dateSelector.genText()}`)
        ]
    });
}