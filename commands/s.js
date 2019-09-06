exports.run = (msg, args, playlist, guildMusic) => {
    if(!msg.guild.voiceConnection || playlist.songs.length === 0) return msg.reply('Nothing is being played.');

    playlist.dispatcher.dispatcher.end();
    msg.channel.send('Song has been skipped');
}