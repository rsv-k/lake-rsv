const additional = require('../additional/additional');

exports.run = (msg, args, queue, playlist) => {
    if(!msg.guild.voiceConnection || queue.songs.length === 0) return msg.reply('Nothing is being played.');

    
    const currentTime = Math.ceil(queue.connection.dispatcher.time / 1000);
    
    const body = `[${queue.songs[0].title}](${queue.songs[0].url})\n\n
    ${additional.convertToHours(currentTime)}${additional.convertToMinutes(currentTime)}:${currentTime % 60 > 10 ? currentTime % 60 : '0' + currentTime % 60}/${queue.songs[0].duration}`;
    
    additional.embedInfo(msg, 'NOW PLAYING', 0xffffff, body);
}