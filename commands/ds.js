exports.run = (msg, args) => {
    const members = [...args].filter(Boolean);
    if (!members[0] || !msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор')) return;
    
    msg.guild.createChannel('disconnect', {type: 'voice'})
    .then (async (channel) => {

        for (let i = 0; i < members.length; i++) {
            const id = members[i].match(/\d+/)[0];
            const member = msg.guild.members.get(id);

            if (!member.voiceChannel) continue;
            await member.setVoiceChannel(channel.id);
        }

        await channel.delete();
    });
}