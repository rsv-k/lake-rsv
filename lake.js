const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const lake = new Discord.Client();

lake.on('message', async (msg) => {
    if (msg.author.bot) return;
    if (msg.channel.type === 'dm' && msg.author.id !== '502171534543028237') return;

    const text = msg.content.toLowerCase();
    if (Math.floor(Math.random() * 1000) === 7) return addReaction(msg, 'lago');
    
    if (text.includes('lago') || text.includes('лаго')) {
        let reaction = 'lago';

        if (Math.floor(Math.random() * 30) === 7) reaction = 'lagotired';
        else if (Math.floor(Math.random() * 100) === 7) rection = 'lagoscared';
        return addReaction(msg, reaction);
    }

    if (msg.channel.type === 'dm' && msg.author.id === '502171534543028237' && text === 'покажи') {
        let posts = (await getDataFromReddit('penis'));
        if (!posts.length) return;

        posts = posts.filter(post => {
            return !post.data.url.includes('v.redd.it') 
            && !post.data.url.includes('reddit.com/r/')
            && !post.data.url.includes('discord.gg')
            && !post.data.url.includes('youtu.be');
        });

        const randomPost = Math.floor(Math.random() * (posts.length - 1));
        const url = posts[randomPost].data.url;
        
        return msg.channel.send(url);
    }
    if (msg.channel.type === 'dm' || text === 'пикчу') return getPicture(msg);
    
    if (msg.channel.type !== 'dm' && msg.channel.name.toLowerCase().includes('голосование')) {
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

    if (text.includes('-ma')) toggleMute(msg, true);
    else if (text.includes('-ua')) toggleMute(msg, false);
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

async function getPicture(msg) {
    const communities = ['funny', 'gifs', 'reactiongifs', 'pics', 'aww', 'PrettyGirls', 'interestingasfuck', 'AdviceAnimals', 'food', 'PeopleFuckingDying', 'rarepuppers', 'NatureIsFuckingLit', 'BeAmazed', 'Tinder', 'natureismetal', 'perfectlycutscreams', 'EarthPorn', 'Anime', 'oddlysatisfying', 'Wellthatsucks','popular', 'mildlyinteresting', 'original', 'meme', 'dank_meme'];
    const randomCommunity = Math.floor(Math.random() * (communities.length - 1));
    let posts = (await getDataFromReddit(communities[randomCommunity]));
    
    if (!posts.length) return;
    posts = posts.filter(post => {
        return !post.data.url.includes('v.redd.it') 
        && !post.data.url.includes('reddit.com/r/')
        && !post.data.url.includes('discord.gg')
        && !post.data.url.includes('youtu.be');
    });

    const randomPost = Math.floor(Math.random() * (posts.length - 1));
    const url = posts[randomPost].data.url;
    let embed = new Discord.RichEmbed();
    if (url.includes('i.redd.it') || url.includes('.jpg') || url.includes('.png')) {
        embed.setImage(url);
    }
    else embed = url;
    
    msg.channel.send(embed);
}
async function getDataFromReddit(community) {
    return (await snekfetch.get(`https://www.reddit.com/r/${community}.json?sort=top&t=week`).query(200)).body.data.children;
}

lake.login(process.env.TOKEN);
lake.on('ready', () => {
    console.log(`Lake has been launched`);
    lake.users.get('502171534543028237').send('Я работаю.');
} );