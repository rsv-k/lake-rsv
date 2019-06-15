exports.run = (msg, args, queue, playlist) => {
    let amount = args[0] || 1;
    if(!msg.guild.voiceConnection || queue.songs.length === 0) return msg.reply('Nothing is being played.');
    if(!amount || amount > queue.songs.length || amount < 1 || !Number(amount)) 
        return msg.reply('Can not skip that amount');

    queue.songs = queue.songs.splice(amount);
    playlist.set(msg.guild.id, queue);
    queue.connection.dispatcher.end();

    msg.reply(`${amount} ${ amount > 1 ? 'songs have' : 'song has'} been skipped`);
}