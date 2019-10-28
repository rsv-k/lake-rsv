exports.run = (msg, args, guildMusic) => {
    const playlist = guildMusic.get(msg.guild.id);
    const voice = msg.member.voiceChannel;

    if (!voice) return msg.reply('You are not in any channel');
    else if (!voice.joinable) return msg.reply('No permission to join channel');
    else if (msg.guild.voiceConnection && msg.member.voiceChannelID === msg.guild.voiceConnection.channel.id) return;
    
    if (playlist) playlist.dispatcher.dispatcher.pause();
    voice.join();
    if (playlist && playlist.dispatcher.dispatcher.paused) {
        setTimeout(() => {
            playlist.dispatcher.dispatcher.resume();
        }, 1000);
    } 

    guildMusic.set(msg.guild.id, playlist);
}