exports.run = (msg, args, queue, playlist) => {
    let authorChannel = msg.member.voiceChannel.id;
    let lakeChannel = msg.guild.voiceConnection.channel.id;

    if(msg.guild.voiceConnection &&  authorChannel === lakeChannel) return;
    if(msg.guild.voiceConnection && authorChannel !== lakeChannel) queue.connection.dispatcher.pause(); 
    
    
    msg.member.voiceChannel.join();
    return new Promise(() => {
        setTimeout(() => {
            queue.connection.dispatcher.resume();
        }, 1000);
    });
}