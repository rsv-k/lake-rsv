exports.run = (msg) => {
    const voice = msg.guild.voiceConnection;
    if (!voice) return;

    voice.disconnect();
}