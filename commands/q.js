const additional = require('../additional');

exports.run = (msg, args, guildMusic) => {
    const playlist = guildMusic.get(msg.guild.id);
    if(!msg.guild.voiceConnection || playlist.songs.length === 0) return msg.reply('Nothing is being played.');

    const songs = playlist.songs;
    let body = `\n\nNow is being played\n [${songs[0].title}](${songs[0].url}) | ${additional.getTime(songs[0].length)}\n\n\_\_\*\*NEXT\*\*\_\_\n\n`;
    let footer = `\*\*${songs.length} songs in queue | ${getTotalTime(songs)} total length\*\*`;
    const length = Math.min(10, songs.length - 1);

    for(let i = 1; i <= length; i++) {
        body += `\`${i}.\` [${songs[i].title}](${songs[i].url}) | \`${additional.getTime(songs[i].length)} requested by: ${songs[i].requested}\`\n\n`;
    }

    additional.embedInfo(msg, 'THE QUEUE', 0xE9A4AF, body + footer);
}

function getTotalTime(songs) {
    const time = songs.map(t => +t.length).reduce((a, b) => a + b);
    
    return additional.getTime(time);
}
