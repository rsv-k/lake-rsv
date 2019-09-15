exports.run = (msg, args, guildMusic) => {
    const voice = msg.guild.voiceConnection;
    if (!voice) return;

    voice.disconnect();
    guildMusic.delete(msg.guild.id);
    
    if (msg) msg.channel.send(`leaving...`)
}