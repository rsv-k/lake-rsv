exports.run = (msg, args, playlist, guildMusic) => {
    const voice = msg.guild.voiceConnection;
    if (!voice) return;
    guildMusic.set(msg.guild.id, { songs: [], dispatcher: null });

    voice.disconnect();
}