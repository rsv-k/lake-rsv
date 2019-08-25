exports.run = (msg, args) => {
    if (!args[0] || !msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор')) return;
    const id = args[0].match(/\d+/)[0];
    
    const member = msg.guild.members.get(id);
    
    msg.guild.createChannel('disconnect', {type: 'voice'})
    .then (async (channel) => {
        await member.setVoiceChannel(channel.id);

        await channel.delete();
    });
}