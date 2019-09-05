const ytdl = require('ytdl-core');
const ytpl = require('ytpl');

const leave = require('./lv.js');
const join = require('./j.js');

exports.run = async (msg, args, playlist, guildMusic) => {
    if (!msg.member.voiceChannel || (!msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор'))) return;

    const link = args[0];
    if (!link || (!ytdl.validateURL(link) && !ytpl.validateURL(link))) return;
    playlist.songs = [...playlist.songs, ...(await fillSongs(link))];
    
    if (playlist.dispatcher) return msg.channel.send('added to queue');
    else await join.run(msg, args, playlist, guildMusic);

    playSong(msg, args, playlist, guildMusic);
}

function playSong(msg, args, playlist, guildMusic) {
    const song = playlist.songs.shift();
    guildMusic.set(msg.guild.id, playlist);
    
    playlist.dispatcher.playStream( ytdl(song.url, {filer: 'audioonly'}), {volume: playlist.volume / 100} )
    .on('end', () => {
        if (!playlist.songs.length) return leave.run(msg, args, playlist, guildMusic);
        playSong(msg, args, playlist, guildMusic);
    });
}

async function fillSongs(link) {
    let info = null;
    if (ytpl.validateURL(link)) {
        info = (await ytpl(link)).items.map(song => {
            return {
                title: song.title,
                length: song.duration,
                url: song.url_simple
            }
        });
    }
    else if (ytdl.validateURL(link)) {
        const song = await ytdl.getBasicInfo(link);
        info = {
            title: song.title,
            length: song.length_seconds,
            url: song.video_url
        }

    }

    return info;
}