exports.run = (msg, args, playlist, guildMusic) => {
    if (!msg.member.voiceChannel) return;

    const link = args[0];
    if (!link) return;
    
}