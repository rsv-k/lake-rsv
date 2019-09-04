exports.run = async (msg, args, playlist, guildMusic) => {
    if (!msg.member.voiceChannel || (!msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор'))) return;
    
    const link = args[0];
    if (!link ) return;
}