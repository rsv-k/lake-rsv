exports.run = (msg) => {
    const channel = msg.member.voiceChannel;
    if (!channel || msg.author.id !== '322741339999698955' && msg.author.id !== '481189853241802792') return;

    msg.delete();

    channel.members.forEach(member => member.setMute(false) );
}