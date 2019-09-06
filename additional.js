module.exports.getTime = (time) => {
    let seconds = time % 60;
    let minutes = ((time - seconds) / 60) % 60;
    let hours = (((time - seconds) / 60) - minutes) / 60;

    return hours !== 0 ? 
    `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
    :
    `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

module.exports.embedInfo = (msg, title, color, body) => {
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

module.exports.convertToSeconds = (time) => {
    const timeToConvert = time.split(':');
    if (timeToConvert.length < 2) return undefined;

    return timeToConvert.map((t, i) => t * Math.pow(60, timeToConvert.length - 1 - i)).reduce((a, b) => a + b);
}