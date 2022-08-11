module.exports = async (Client, oldMember, newMember) => {
    if (oldMember.pending && !newMember.pending) {
        let role = await newMember.guild.roles.fetch(Client.settings.memberRoleID);
        if (role) {
            await newMember.roles.add(role);
        }
    }
}