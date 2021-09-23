module.exports = async (Client, interaction) => {
    if (interaction.isButton()) {
        let button = Client.buttons.get(interaction.customId);

        if (button) button(Client, interaction)
    }
}