const ytdl = require('ytdl-core');

const additional = require('../additional/additional');
exports.run = (msg, args, queue, playlist) => {
    const link = args[0];
    // check if args exists or if it's a valid link to produce the song
    if(!link || !additional.isPlayable(link)) return msg.reply('Invalid url!');
    
    play(msg, link, queue, playlist);
}

async function play(msg, link, queue, playlist) {
    queue.songs = queue.songs.concat((await additional.getSongs(link)));

    if(queue.connection) {
        playlist.set(msg.guild.id, queue);

        return msg.reply('Song has been added to queue');
    }

    queue.connection = await msg.member.voiceChannel.join();
    stream(msg, queue, playlist);
}

function stream(msg, queue, playlist) {
    playlist.set(msg.guild.id, queue);

    queue.connection.playStream( 
        ytdl(queue.songs[0].url, {filter: 'audioonly'}), {volume : queue.volume / 100})
        .on('end', () => {
        queue.songs.shift();
        
        queue.songs.length === 0 ? msg.guild.voiceConnection.disconnect() : 
                                   stream(msg, queue, playlist);
    });
}
 