const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const lake = new Discord.Client();

lake.on('message', async (msg) => {
    if (msg.author.bot || (!msg.guild && msg.author.id !== '502171534543028237')) return;
    const text = msg.content.toLowerCase();

    if (text.includes('lago') || text.includes('лаго')) {
        let reaction = random(30) === 7 ? 'lagotired' : 'lago';
        if (random(100) === 7) reaction = 'lagoscared';

        return addReaction(msg, reaction);
    }

    if (msg.author.id === '502171534543028237' && text === 'покажи') {
        let posts = (await getDataFromReddit('penis'));
        if (!posts.length) return;

        const post = random(posts.length);
        const url = posts[post].data.url;
        
        return msg.channel.send(url);
    }
    
    if (msg.channel.name.toLowerCase().includes('голосование')) {
        const text = msg.content;
        const numbers = text.match(/\d+./g);
        if (!numbers || !text.toLowerCase().includes('темы')) return;

        const title = text.split('\n')[0];
        let body = '';
        text.split('\n').forEach((item, i) => {
            body += i !== 0 ? item + '\n' : '';
        })
        
        const embed = new Discord.RichEmbed()
            .setTitle(title)
            .setColor(0x00000)
            .setDescription(body);
            msg.reply({embed}).then(async (message) => {
                const lastNumber = parseInt(numbers[numbers.length - 1]);
                const emojiNumbers = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];

                for(let i = 0; i < lastNumber; i++) {
                    await message.react(`${emojiNumbers[i]}`);
                }
            });
            msg.delete();
    }

    if (text.includes('-ma')) return toggleMute(msg, true);
    else if (text.includes('-ua')) return toggleMute(msg, false);
});

function toggleMute(msg, value) {
    const channel = msg.member.voiceChannel;
    if (!channel || msg.author.id !== '322741339999698955') return;
    msg.delete();

    channel.members.forEach(member => {
        if (member.user.id !== msg.author.id) member.setMute(value);
    })
}
function addReaction(msg, reaction) {
    const lago = lake.guilds.get('565647445758050304').emojis.find(emoji => emoji.name === reaction);
    msg.react(lago.id);
}

async function getDataFromReddit(community) {
    return (await snekfetch.get(`https://www.reddit.com/r/${community}.json?sort=top&t=week`)).body.data.children;
}
function random(max) {
    return Math.floor(Math.random() * max);
}
lake.login(process.env.TOKEN);
lake.on('ready', () => console.log(`Ready to work`) );