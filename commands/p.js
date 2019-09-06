const ytdl = require('ytdl-core');
const ytpl = require('ytpl');

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
    
    playlist.dispatcher.playStream( ytdl(playlist.songs[0].url, {filer: 'audioonly'}), {volume: playlist.volume / 100} )
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
                length: convertToSeconds(song.duration),
                url: song.url_simple
            }
        });
    }
    else if (ytdl.validateURL(link)) {
        const {title, length_seconds: length, video_url: url} = await ytdl.getBasicInfo(link);
        info.push({ title, length, url });
    }
    return info;
}

function convertToSeconds(time) {
    const timeToConvert = time.split(':');
    return timeToConvert.map((t, i) => t * Math.pow(60, timeToConvert.length - 1 - i)).reduce((a, b) => a + b);
}