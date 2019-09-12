const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const additional = require('../additional');

exports.run = async (msg, args, playlist, guildMusic) => {
    if (!msg.member.voiceChannel) msg.reply("You are not in any  channel");

    const link = args[0];
    if (!link || (!ytdl.validateURL(link) && !ytpl.validateURL(link))) {
        return msg.reply('invalid url');
    }
    
    clearInterval(playlist.timerOnLeave);
    playlist.songs = [...playlist.songs, ...(await additional.fillSongs(msg, link))];
    if (playlist.dispatcher) return msg.channel.send('added to queue');

    playlist.dispatcher = await msg.member.voiceChannel.join();
    playSong(msg, args, playlist, guildMusic);
}

function playSong(msg, args, playlist, guildMusic) {
    guildMusic.set(msg.guild.id, playlist);
    if (playlist.clear) {
        return guildMusic.delete(msg.guild.id);
    }
    
    if (!playlist.songs.length) {
        playlist.timerOnLeave = setTimeout(() => {
            guildMusic.delete(msg.guild.id);
            msg.guild.voiceConnection.disconnect();
        }, 5 * 60 * 1000);

        return;
    }
    
    const streamOptions = {volume: playlist.volume / 100, seek: playlist.songs[0].seek, bitrate: 192000}
    const stream = ytdl(playlist.songs[0].url, {filer: 'audioonly'});
    playlist.dispatcher.playStream( stream, streamOptions )
    .on('end', () => {
        playlist.songs.shift();
        playSong(msg, args, playlist, guildMusic);
    });
}