exports.run = async (msg, args, playlist, guildMusic) => {
    const voice = msg.member.voiceChannel;
    if (!voice || !voice.joinable) return;
    
    const connection = await voice.join();
    playlist.dispatcher = connection;
    guildMusic.set(msg.guild.id, playlist);
}