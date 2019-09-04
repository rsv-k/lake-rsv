exports.run = (msg, args, playlist, guildMusic) => {
    const voice = msg.guild.voiceConnection;
    if (!voice) return;

    voice.disconnect();
}