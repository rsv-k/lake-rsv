const additional = require('../additional/additional');

exports.run = async (msg, args, queue, playlist) => {
    const link = args[0];

    // check if args exists or if it's a valid link to produce the song
    if(!link || !additional.isPlayable(link)) return msg.reply('Invalid url!');

    queue.songs = [queue.songs[0], ...await additional.getSongs(link), ...queue.songs.slice(1)];
    playlist.set(msg.guild.id, queue);
    
    await queue.connection.dispatcher.end();
}