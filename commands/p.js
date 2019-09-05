const ytdl = require('ytdl-core');
const ytpl = require('ytpl');

exports.run = async (msg, args, playlist, guildMusic) => {
    if (!msg.member.voiceChannel || (!msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор'))) return;

    const link = args[0];
    if (!link || (!ytdl.validateURL(link) && !ytpl.validateURL(link))) return;

    playlist.songs = [...playlist.songs, ...(await fillSongs(link))];
    
    if (playlist.dispatcher) return msg.channel.send('added to queue');

    playlist.dispatcher = await msg.member.voiceChannel.join();
    playSong(msg, args, playlist, guildMusic);
}

function playSong(msg, args, playlist, guildMusic) {
    if (playlist.leave || !playlist.songs.length) {
        playlist.dispatcher.disconnect();
        return guildMusic.delete(msg.guild.id);
    }
    
    const song = playlist.songs.shift();
    guildMusic.set(msg.guild.id, playlist);
    
    playlist.dispatcher.playStream( ytdl(song.url, {filer: 'audioonly'}), {volume: playlist.volume / 100} )
    .on('end', () => {
        playSong(msg, args, playlist, guildMusic);
    });
}

async function fillSongs(link) {
    let info = [];
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
        info.push({
            title: song.title,
            length: song.length_seconds,
            url: song.video_url
        });
    }

    return info;
}