exports.run = (msg, args, playlist, guildMusic) => {
    if (!playlist.connection) return;

    guildMusic.delete(msg.guild.id);
    return playlist.disconnect();
}