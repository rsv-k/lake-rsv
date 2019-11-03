exports.run = (msg, args) => {
    //Filter out all bots
    
    const members = args.filter(id => {
        const user = getMember(msg, id);

        return !user.user.bot;
    });

    if (!members[0] || !msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор')) return msg.reply('invalid user');
    
    msg.guild.createChannel('disconnect', {type: 'voice'})
    .then (async (channel) => {

        for (let i = 0; i < members.length; i++) {
            const member = getMember(msg, members[i]);
            
            if (!member.voiceChannel) continue;
            await member.setVoiceChannel(channel.id);
        }

        await channel.delete();
    });
}

function getMember(msg, id) {
    return msg.guild.members.get(id.match(/\d+/)[0]);
}