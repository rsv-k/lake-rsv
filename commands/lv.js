exports.run = (msg, args, playlist, guildMusic) => {
    if (!playlist.dispatcher) return;

    playlist.leave = true;
    playlist.dispatcher.disconnect();
}