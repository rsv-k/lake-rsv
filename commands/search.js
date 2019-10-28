const search = require('youtube-search');
const play = require('./p');
const options = {
    maxResults: 1,
    key: process.env.YOUTUBE_API
}

exports.run = (msg, args, guildMusic) => {
    const songName = args.join(' ');

    search(songName, options, (err, res) => {
        const playlist = guildMusic.get(msg.guild.id);

        if (err || !res.length) return msg.channel.send('I did not find anything');

        play.run(msg, [res[0].link], playlist, guildMusic);
    })
}