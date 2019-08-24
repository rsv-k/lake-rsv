exports.run = (msg) => {
    const voice = msg.member.voiceChannel;
    if (!voice || !voice.joinable) return;
    
    voice.join();
}