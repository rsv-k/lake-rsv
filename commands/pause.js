exports.run = (msg, args, playlist, guildMusic) => {
    if(!msg.guild.voiceConnection || playlist.songs.length === 0) return msg.reply('Nothing is being played.');
    
    if(!playlist.dispatcher.dispatcher.paused) msg.reply('Song has been paused');
    playlist.dispatcher.dispatcher.pause();
}