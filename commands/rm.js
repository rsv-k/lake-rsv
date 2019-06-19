exports.run = (msg, args, queue, playlist) => {
    let start = +args[0];
    let amount = +args[1];
   
    if(!start || !amount  || start > queue.songs.length || start <= 0 || amount > queue.songs.length || amount < 0 || start + amount > queue.songs.length) 
        return msg.reply(`Can not remove that`);

    queue.songs.splice(start, amount);
    playlist.set(msg.guild.id, queue);
    msg.reply(`${Math.abs(amount)} songs have been deleted`);
}