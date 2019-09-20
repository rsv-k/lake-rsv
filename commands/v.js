exports.run = (msg, args, guildMusic) => {
    const playlist = guildMusic.get(msg.guild.id);

    let volume = Math.round(args[0]);
    if (volume === playlist.volume) return;

    if (!playlist.dispatcher) return;
    if (volume < 0 || volume > 100 || !Number(volume)) return msg.reply('I can\'t set that volume');
    playlist.volume = volume;

    playlist.dispatcher.dispatcher.setVolume(playlist.volume / 100);
    msg.channel.send('Volume has been set to ' + volume);
}