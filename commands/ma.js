exports.run = (msg) => {
    const channel = msg.member.voiceChannel;
    if (!channel || !msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор')) return;

    channel.members.forEach(member => {
        if (member.id !== msg.author.id) member.setMute(true);
    });
}