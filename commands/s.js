exports.run = (msg, args, guildMusic) => {
    const playlist = guildMusic.get(msg.guild.id);
    const amount = args[0] || 1;

    if(!msg.guild.voiceConnection || playlist.songs.length === 0) return msg.reply('Nothing is being played.');
    if(!amount || amount > playlist.songs.length || amount < 1 || !Number(amount)) 
        return msg.reply('Can not skip that amount');

    if (amount > 1) {
        playlist.songs = playlist.songs.splice(amount - 1);
    }
    
    playlist.dispatcher.dispatcher.end();
    guildMusic.set(msg.guild.id, playlist);
    
    msg.channel.send(`${amount} ${ amount > 1 ? 'songs have' : 'song has'} been skipped`);
}