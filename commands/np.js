const additional = require('../additional');
exports.run = (msg, args, playlist, guildMusic) => {
    if(!msg.guild.voiceConnection || playlist.songs.length === 0) return msg.reply('Nothing is being played.');

    const currentTime = Math.ceil(playlist.dispatcher.dispatcher.time / 1000);
    const body = `[${playlist.songs[0].title}](${playlist.songs[0].url})\n\n${additional.getTime(currentTime)} / ${additional.getTime(playlist.songs[0].length)}`;

    additional.embedInfo(msg, 'NOW PLAYING', 0xE9A4AF, body);
}