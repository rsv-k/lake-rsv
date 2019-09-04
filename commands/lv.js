exports.run = (msg, args, playlist, guildMusic) => {
    if (!playlist.dispatcher) return;

    guildMusic.delete(msg.guild.id);
    return playlist.disconnect();
}