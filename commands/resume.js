exports.run = (msg, args, queue, playlist) => {
    if(!msg.guild.voiceConnection || queue.songs.length === 0) return msg.reply('Nothing is being played.');

    if(queue.connection.dispatcher.paused) msg.reply('Song has been resumed');
    queue.connection.dispatcher.resume();
}