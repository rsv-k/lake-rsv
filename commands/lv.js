exports.run = async (msg, args, queue, playlist) => {
    if(!msg.guild.voiceConnection) return msg.reply(`I'm not in any channel`);
    if(queue.songs.length !== 0) msg.reply('Left the channel...');
    
    queue = {volume: queue.volume, songs: []};
    playlist.set(msg.guild.id, queue);

    let voiceChannel = msg.guild.channels.find( channel => channel.id === msg.guild.voiceConnection.channel.id);
    voiceChannel.leave();
}