exports.run = (msg) => {
    const channel = msg.member.voiceChannel;
    if (!msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор')) return;

    msg.delete();

    channel.members.forEach(member => member.setMute(false) );
}