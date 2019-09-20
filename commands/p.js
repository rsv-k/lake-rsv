const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const additional = require('../additional');

exports.run = async (msg, args, guildMusic) => {
    if (!msg.member.voiceChannel) return msg.reply("You are not in any  channel");
    if (!guildMusic.get(msg.guild.id)) guildMusic.set(msg.guild.id, { songs: [], dispatcher: null, volume: 5 });

    const playlist = guildMusic.get(msg.guild.id);

    const link = args[0];
    if (!link || (!ytdl.validateURL(link) && !ytpl.validateURL(link))) {
        return msg.reply('invalid url');
    }
    
    clearInterval(playlist.timerOnLeave);
    playlist.songs = [...playlist.songs, ...(await additional.fillSongs(msg, link))];
    if (playlist.dispatcher) return msg.channel.send('added to queue');

    playlist.dispatcher = await msg.member.voiceChannel.join();
    guildMusic.set(msg.guild.id, playlist);

    playSong(msg, args, guildMusic);
}

function playSong(msg, args, guildMusic) {
    const playlist = guildMusic.get(msg.guild.id);
    if (playlist.clear) return guildMusic.delete(msg.guild.id);
    
    if (!playlist.songs.length && guildMusic.get(msg.guild.id)) {
        playlist.timerOnLeave = setTimeout(() => {
            guildMusic.delete(msg.guild.id);
            msg.guild.voiceConnection.disconnect();
        }, 5 * 60 * 1000);

        return;
    }
    
    const streamOptions = {volume: playlist.volume / 100, seek: playlist.songs[0].seek, bitrate: 192000}
    const stream = ytdl(playlist.songs[0].url, {filer: 'audioonly'});

    playlist.dispatcher.playStream(stream, streamOptions)
    .on('end', () => {
        if (!guildMusic.get(msg.guild.id)) return;
        
        playlist.songs.shift();
        guildMusic.set(msg.guild.id, playlist);
        playSong(msg, args, guildMusic);
    });
}