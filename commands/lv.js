exports.run = async (msg, args, queue, playlist) => {
    if(!msg.guild.voiceConnection) return msg.reply(`I'm not in any channel`);

    queue.songs = [];
    playlist.delete(msg.guild.id);
    await msg.guild.voiceConnection.disconnect();
    
    msg.reply('Left the channel...');
}