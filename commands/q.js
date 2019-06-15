const additional = require('../additional/additional');
exports.run = (msg, args, queue, playlist) => {
    if(!msg.guild.voiceConnection || queue.songs.length === 0) return msg.reply('Nothing is being played.');

    const songs = queue.songs;
    
    let body = `\n\nNow is being played\n [${songs[0].title}](${songs[0].url}) | ${songs[0].duration}\n\n\_\_\*\*NEXT\*\*\_\_\n\n`;
    let footer = `\*\*${songs.length} songs in queue | ${songsTotalTime(songs)} total length\*\*`;

    const length = songs.length > 10 ? 10 : songs.length - 1;
    
    for(let i = 1; i <= length; i++) {
        body += `\`${i}.\` [${songs[i].title}](${songs[i].url}) | ${songs[i].duration}\n\n`;
    }

    additional.embedInfo(msg, 'THE QUEUE', 0x000, body + footer);
}

function songsTotalTime(songs) {
    let totalSeconds = 0;
    let time;
    songs.forEach(song => {
        time = song.duration.split(':');
        time = time.length !== 3 ? ['0', ...time] : time;
        
        totalSeconds += +time[0] * 3600;
        totalSeconds += +time[1] * 60;
        totalSeconds += +time[2];
    });

    return `${additional.convertToHours(totalSeconds)}${additional.convertToMinutes(totalSeconds)}:${totalSeconds % 60 > 10 ? totalSeconds % 60 : '0' + totalSeconds % 60}`;
}
