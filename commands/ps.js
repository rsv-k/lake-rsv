const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const additional = require('../additional');

exports.run = async (msg, args, guildMusic) => {
    const playlist = guildMusic.get(msg.guild.id);
    if (!args[0] || !ytdl.validateURL(args[0]) || !ytpl.validateURL(args[0])) return msg.channel.send('incorrect link');

    playlist.songs = [playlist.songs[0], ...await additional.fillSongs(msg, args[0]), ...playlist.songs.slice(1)];

    playlist.dispatcher.dispatcher.end();
}