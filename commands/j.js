exports.run = (msg, args, playlist, guildMusic) => {
    const voice = msg.member.voiceChannel;
    if (!voice || !voice.joinable) return;
    
    voice.join();
}