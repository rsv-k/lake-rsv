exports.run = (msg, args, playlist, guildMusic) => {
    if(!msg.guild.voiceConnection || playlist.songs.length === 0) return msg.reply('Nothing is being played.');

    const songs = playlist.songs;
    let body = `\n\nNow is being played\n [${songs[0].title}](${songs[0].url}) | ${getTime(songs[0].length)}\n\n\_\_\*\*NEXT\*\*\_\_\n\n`;
    let footer = `\*\*${songs.length} songs in queue | ${getTotalTime(songs)} total length\*\*`;
    const length = Math.min(10, songs.length - 1);

    for(let i = 1; i <= length; i++) {
        body += `\`${i}.\` [${songs[i].title}](${songs[i].url}) | ${getTime(songs[i].length)}\n\n`;
    }

    embedInfo(msg, 'THE QUEUE', 0xe9a4af, body + footer);
}

function getTime(time) {
    let seconds = time % 60;
    let minutes = ((time - seconds) / 60) % 60;
    let hours = (((time - seconds) / 60) - minutes) / 60;

    return hours !== 0 ? 
    `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
    :
    `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function getTotalTime(songs) {
    const time = songs.map(t => +t.length).reduce((a, b) => a + b);
    
    return getTime(time);
}

function embedInfo(msg, title, color, body) {
    const {RichEmbed} = require('discord.js');
    const embed = new RichEmbed();
    embed.setTitle(title)
    // Set the color of the embed (side line)
    .setColor(color)
    // Set the main content of the embed
    .setDescription(body);
    
    // Send the embed to the same channel as the message
    msg.channel.send(embed);
}