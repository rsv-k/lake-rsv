exports.run = (msg, args, playlist, guildMusic) => {
    let volume = Math.round(args[0]);
    if (volume === playlist.volume) return;

    if (!playlist.dispatcher) return;
    if (volume < 0 || volume > 50 || !Number(volume)) return;
    playlist.volume = volume;

    playlist.dispatcher.dispatcher.setVolume(playlist.volume / 100);
}