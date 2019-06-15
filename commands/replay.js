exports.run = (msg, args, queue, playlist) => {
    if(!msg.guild.voiceConnection || queue.songs.length === 0) return msg.reply('Nothing is being played.');

    queue.songs.unshift(queue.songs[0]);
    queue.connection.dispatcher.end();
}