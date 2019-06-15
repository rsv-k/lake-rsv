const ytpl = require('ytpl');
const ytdl = require('ytdl-core');

module.exports.getSongs = async function(link) {
    const info = !isPlaylist(link) ? await ytdl.getBasicInfo(link) : undefined;
    
    let song = await getPlaylist(link) || 
    [{ 
        title: info.title, 
        url: info.video_url, 
        duration: `${this.convertToHours(info.length_seconds)}${this.convertToMinutes(info.length_seconds)}:${info.length_seconds % 60 > 10 ? info.length_seconds % 60 : '0' + info.length_seconds % 60}` }];

    return song;
}
function getPlaylist(link) {
    if(!isPlaylist(link)) return undefined;
    let result = ytpl(link);
    let songs = result.then(value => {
        value.items = value.items.map(song => ({ title: song.title, url: song.url, duration: song.duration }))
                      .filter(song => song.title !== '[Deleted video]' && song.title !== '[Private video]');
                      
        return value.items;
    });
    return songs;
}

module.exports.isPlayable = (link) => ytdl.validateURL(link) || isPlaylist(link)
function isPlaylist(link) {
    let isValid = true;
    ytpl(link, (err, playlist) => {
        if(err) isValid = false;
    })

    return isValid;
}

module.exports.convertToMinutes = (seconds) => {
    let minutes = ~~(seconds / 60);
        minutes = minutes >= 60 ? minutes % 60 : minutes;

    return minutes > 10 ? minutes : '0' + minutes; 
}
module.exports.convertToHours = (seconds) => {
    if(seconds < 3600) return '';
    let hours = ~~(seconds / 3600);
        
    return hours + ':';
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