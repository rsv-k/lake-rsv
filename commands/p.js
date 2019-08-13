let commandFile = require(`./lv.js`)
const ytdl = require('ytdl-core');

const additional = require('../additional/additional');
exports.run = (msg, args, queue, playlist) => {
    if(!msg.member.voiceChannel.joinable) return msg.reply('Can not join that channel');

    const link = args[0];
    // check if args exists or if it's a valid link to produce the song
    if(!link || !additional.isPlayable(link)) return msg.reply('Invalid url!');
    
    play(msg, link, queue, playlist);
}

async function play(msg, link, queue, playlist) {
    let songs = await additional.getSongs(link);
    queue.songs = queue.songs.concat(songs);
    
    if(queue.connection) {
        playlist.set(msg.guild.id, queue);
        
        return msg.reply(`${songs.length > 1 ? 'Songs have' : 'Song has'} been added to queue`);
    }

    queue.connection = await msg.member.voiceChannel.join();
    stream(msg, link, queue, playlist);
}

async function stream(msg, args, queue, playlist) {
    playlist.set(msg.guild.id, queue);

    await queue.connection.playStream( 
        ytdl(queue.songs[0].url, {filter: 'audioonly', begin: 120000}), {volume : queue.volume / 100})
        .on('end', () => {
        queue.songs.shift();
         
        queue.songs.length === 0 ? commandFile.run(msg, args, queue, playlist) : stream(msg, args, queue, playlist);
    });
}
 