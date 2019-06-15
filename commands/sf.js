exports.run = (msg, args, queue, playlist) => {
    if(!msg.guild.voiceConnection || queue.songs.length === 0) return msg.reply('Nothing is being played.');
    if(queue.songs.length <= 2) return msg.reply('The queue is to small to be shuffled');
    
    queue.songs = shuffle(queue.songs);
    playlist.set(msg.guild.id, queue);
    msg.reply('The queue has been shuffled');
}

function shuffle(a) {
    for (let i = a.length - 1; i > 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}