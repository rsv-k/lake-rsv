exports.run = (msg, args, queue, playlist) => {
    if(!msg.guild.voiceConnection || queue.songs.length === 0) return msg.reply('Nothing is being played.');

    queue.songs = [];
    playlist.set(msg.guild.id, queue);
    queue.connection.dispatcher.end();
    
    msg.reply('The queue has been cleared');
}