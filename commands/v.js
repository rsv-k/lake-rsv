exports.run = (msg, args, queue, playlist) => {
    let volume = Math.round(args[0]);
    
    if(volume === queue.volume) return;
    if(!msg.guild.voiceConnection || queue.songs.length === 0) return msg.reply('Nothing is being played.');
    if(!volume || volume < 1 || volume > 100 || !Number(volume)) return msg.reply('Can not set that volume');

    queue.connection.dispatcher.setVolume(volume / 100);
    queue.volume = volume;
    msg.reply(`Volume has been set to ${volume}`);
}