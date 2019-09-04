const ytdl = require('ytdl-core');
const leave = require('./lv.js');
const join = require('./j.js');

exports.run = async (msg, args, playlist, guildMusic) => {
    if (!msg.member.voiceChannel || (!msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор'))) return;

    const link = args[0];
    if (!link || !ytdl.validateURL(link)) return;
    playlist.songs.push(link);

    if (playlist.dispatcher) return;
    else await join.run(msg, args, playlist, guildMusic);

    playSong(msg, args, playlist, guildMusic);
}

function playSong(msg, args, playlist, guildMusic) {
    const song = playlist.songs.shift();
    guildMusic.set(msg.guild.id, playlist);
    
    playlist.dispatcher.playStream( ytdl(song, {filter: 'audioonly'}), {volume: playlist.volume / 100} )
    .on('end', () => {
        if (!playlist.songs.length) return leave.run(msg, args, playlist, guildMusic);
        playSong(msg, args, playlist, guildMusic);
    });
}