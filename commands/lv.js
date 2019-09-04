exports.run = (msg, args, playlist, guildMusic) => {
    const voice = msg.guild.voiceConnection;
    if (!voice) return;

    guildMusic.delete(msg.guild.id);
    voice.disconnect();
}