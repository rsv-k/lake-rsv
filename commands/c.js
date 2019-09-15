exports.run = (msg, args, playlist, guildMusic) => {
    const playlist = guildMusic.get(msg.guild.id);
    if(!msg.guild.voiceConnection || playlist.songs.length === 0) return msg.reply('Nothing is being played.');

    playlist.clear = true;
    playlist.songs = [];
    guildMusic.set(msg.guild.id, playlist);
    playlist.dispatcher.dispatcher.end();
    
    msg.reply('The queue has been cleared');
}