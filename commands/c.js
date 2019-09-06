exports.run = (msg, args, playlist, guildMusic) => {
    if(!msg.guild.voiceConnection || playlist.songs.length === 0) return msg.reply('Nothing is being played.');

    playlist.songs = [];
    guildMusic.set(msg.guild.id, playlist);
    playlist.dispatcher.dispatcher.end();
    
    msg.reply('The queue has been cleared');
}