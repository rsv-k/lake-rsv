const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const additional = require('../additional');

exports.run = async (msg, args, playlist, guildMusic) => {
    if (!msg.member.voiceChannel || (!msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор'))) return;

    const link = args[0];
    if (!link || (!ytdl.validateURL(link) && !ytpl.validateURL(link))) return;
    console.log(ytdl.validateURL(link), ytpl.validateURL(link));
    clearInterval(playlist.timerOnLeave);
    playlist.songs = [...playlist.songs, ...(await fillSongs(link))];
    if (playlist.dispatcher) return msg.channel.send('added to queue');

    playlist.dispatcher = await msg.member.voiceChannel.join();
    playSong(msg, args, playlist, guildMusic);
}

function playSong(msg, args, playlist, guildMusic) {
    guildMusic.set(msg.guild.id, playlist);
    if (playlist.leave) return guildMusic.delete(msg.guild.id);
    
    if (!playlist.songs.length) {
        playlist.timerOnLeave = setTimeout(() => {
            guildMusic.delete(msg.guild.id);
            msg.guild.voiceConnection.disconnect();
        }, 5 * 60 * 1000);

        return;
    }
    
    const streamOptions = {volume: playlist.volume / 100, seek: playlist.songs[0].seek}
    const stream = ytdl(playlist.songs[0].url, {filer: 'audioonly'});
    playlist.dispatcher.playStream( stream, streamOptions )
    .on('end', () => {
        playlist.songs.shift();
        playSong(msg, args, playlist, guildMusic);
    });
}

async function fillSongs(link) {
    let info = [];
    if (ytpl.validateURL(link)) {
        info = (await ytpl(link)).items
        .filter(song => !song.title.includes('[Deleted video]') && !song.title.includes('[Private video]'))
        .map(song => {
            return {
                title: song.title,
                length: additional.convertToSeconds(song.duration),
                url: song.url_simple,
                seek: 0
            }
        });
    }
    else if (ytdl.validateURL(link)) {
        const {title, length_seconds: length, video_url: url} = await ytdl.getBasicInfo(link);
        info.push({ title, length, url, seek: 0 });
    }
    return info;
}