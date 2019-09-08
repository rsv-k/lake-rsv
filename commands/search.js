const search = require('youtube-search');
const play = require('./p');

exports.run = (msg, args, playlist, guildMusic) => {
    const songName = args.join(' ');
    const options = {
        maxResults: 1,
        key: process.env.YOUTUBE_API
    }

    search(songName, options, (err, res) => {
        if (err || !res.length) return msg.channel.send('I did not find anything');

        play.run(msg, [res[0].link], playlist, guildMusic);
    })
}