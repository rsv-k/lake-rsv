exports.run = (msg, args, playlist, guildMusic) => {
    const voice = msg.member.voiceChannel;
    if (!voice) return msg.reply('You are not in any channel');
    else if (!voice.joinable) return msg.reply('No permission to join channel');
    else if (msg.guild.voiceConnection && msg.member.voiceChannelID === msg.guild.voiceConnection.channel.id) return;
    
    if (playlist.dispatcher) playlist.dispatcher.dispatcher.pause();
    voice.join();
    if (playlist.dispatcher && playlist.dispatcher.dispatcher.paused) {
        setTimeout(() => {
            playlist.dispatcher.dispatcher.resume();
        }, 1000);
    } 
}