exports.run = async (msg, args, playlist, guildMusic) => {
    const voice = msg.member.voiceChannel;
    if (!voice || !voice.joinable) return;
    
    await voice.join();
}