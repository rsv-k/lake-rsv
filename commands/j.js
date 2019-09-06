exports.run = (msg, args, playlist, guildMusic) => {
    const voice = msg.member.voiceChannel;
    if (!voice || !voice.joinable || msg.member.voiceChannelID || msg.guild.voiceConnection.channel.id) return;
    
    if (playlist.dispatcher) playlist.dispatcher.dispatcher.pause();
    voice.join();
    if (playlist.dispatcher && playlist.dispatcher.dispatcher.paused) {
        setTimeout(() => {
            playlist.dispatcher.dispatcher.resume();
        }, 1000);
    } 
}