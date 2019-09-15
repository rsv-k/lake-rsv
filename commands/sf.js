exports.run = (msg, args, guildMusic) => {
    const playlist = guildMusic.get(msg.guild.id);

    if(!msg.guild.voiceConnection || !playlist.songs.length) return msg.channel.send('Nothing is being played.');
    if(playlist.songs.length <= 2) return msg.channel.send('The queue is to small to be shuffled');

    playlist.songs = shuffle(playlist.songs);
    guildMusic.set(msg.guild.id, playlist);
    msg.channel.send('The queue has been shuffled');
}

function shuffle(a) {
    for (let i = a.length - 1; i > 1; i--) {
        const j = Math.floor(Math.random() * (i ) + 1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}