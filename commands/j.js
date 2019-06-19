exports.run = (msg, args, queue, playlist) => {
    let authorChannel = msg.member.voiceChannel;
    let lakeChannel = msg.guild.voiceConnection;
    
    if(!authorChannel.joinable) return msg.reply('Can not join that channel');
    if(lakeChannel !== null && queue.connection && msg.guild.voiceConnection && authorChannel.id !== lakeChannel.channel.id) queue.connection.dispatcher.pause(); 

    msg.member.voiceChannel.join();
    if(queue.connection) {
        return new Promise(() => {
            setTimeout(() => {
                queue.connection.dispatcher.resume();
            }, 1000);
        });
    }
}