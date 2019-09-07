const additional = require('../additional');
exports.run = (msg, args, playlist, guildMusic) => {
    const time = additional.convertToSeconds(args[0]);
    if (!time) return msg.channel.send('Incorrect value');

    playlist.songs[0].seek = time;
    playlist.songs = [playlist.songs[0], ...playlist.songs];

    playlist.dispatcher.dispatcher.end();
}