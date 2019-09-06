exports.run = (msg) => {
    const channel = msg.member.voiceChannel;
    
    if (!channel || msg.author.id !== '481189853241802792' && msg.author.id !== '322741339999698955') return;
    if (!msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор')) return;

    msg.delete();
    
    channel.members.forEach(member => {
        if (member.id !== msg.author.id) member.setMute(true);
    });
}