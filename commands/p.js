const join = require(`./j.js`);
const leave = require('./lv.js');
const ytdl = require('ytdl-core');

exports.run = async (msg, args, playlist, guildMusic) => {
    console.log('p called');
    if (!msg.member.voiceChannel || (!msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор'))) return;
    
    const link = args[0];
    if (!link || !ytdl.validateURL(link)) return;
    playlist.songs.push(link);
    guildMusic.set(msg.guild.id, playlist);
    if (playlist.dispatcher) return;
    else await join.run(msg, args, playlist, guildMusic);

    playSong(msg, args, playlist, guildMusic);
}

function playSong(msg, args, playlist, guildMusic) {
    const song = playlist.songs.shift();

    playlist.dispatcher.playStream( ytdl(song) )
    .on('end', () => {
        if (!playlist.songs.length) return leave.run(msg, args, playlist, guildMusic);
        guildMusic.set(msg.guild.id, playlist);
        playSong(msg, playlist, guildMusic);
    });
}