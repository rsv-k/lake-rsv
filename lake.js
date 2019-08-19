const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const lake = new Discord.Client();

lake.on('message', async (msg) => {
    if (msg.author.bot || msg.channel.type === 'dm' && msg.author.id !== '502171534543028237') return;
    const text = msg.content.toLowerCase();

    if (text.includes('lago') || text.includes('лаго')) {
        let reaction = random(30) === 7 ? 'lagotired' : 'lago';
        if (random(100) === 7) reaction = 'lagoscared';

        return addReaction(msg, reaction);
    }

    if (msg.channel.type === 'dm' && msg.author.id === '502171534543028237' && text === 'покажи') {
        let posts = (await getDataFromReddit('penis'));
        if (!posts.length) return;

        const post = random(posts.length);
        const url = posts[post].data.url;
        
        return msg.channel.send(url);
    }
    if (text === 'пикчу' && msg.channel.name.toLowerCase().includes('картинки')) return getPicture(msg);
    
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
    const communities = ['funny', 'gifs', 'reactiongifs', 'pics', 'aww', 'PrettyGirls', 'interestingasfuck', 'AdviceAnimals', 'food', 'PeopleFuckingDying', 'rarepuppers', 'NatureIsFuckingLit', 'BeAmazed', 'Tinder', 'natureismetal', 'perfectlycutscreams', 'EarthPorn', 'Anime', 'oddlysatisfying', 'Wellthatsucks','popular', 'mildlyinteresting', 'original', 'meme', 'dank_meme', 'CrappyDesign', 'Art', 'CatastrophicFailure', 'therewasanattempt', 'Unexpected', 'hmmm', 'perfectloops', 'facepalm', 'suicidebywords', 'starterpacks', 'FellowKids', 'meirl', 'memes', 'trashy'];
    const randomCommunity = random(communities.length);
    console.log(communities[randomCommunity]);
    let posts = (await getDataFromReddit(communities[randomCommunity]));

    posts = posts.filter(post => {
        return post.data
        && post.data.url.toLowerCase().includes('.jpg')
        || post.data.url.toLowerCase().includes('.png')
        || post.data.url.includes('imgur.com')
        || post.data.url.includes('imgflip.com')
        || post.data.url.includes('gfycat.com')
        || post.data.url.includes('.gif')
    });
    if (!posts.length) getPicture(msg);

    const randomPost = random(posts.length);
    console.log(randomPost, posts.length);
    const url = posts[randomPost].data.url;
    
    return msg.channel.send(url);
}
async function getDataFromReddit(community) {
    return (await snekfetch.get(`https://www.reddit.com/r/${community}.json?sort=top&t=week`).query(200)).body.data.children;
}
function random(max) {
    return Math.floor(Math.random() * max);
}
lake.login(process.env.TOKEN);
lake.on('ready', () => {
    console.log(`Ready to work`);
    // lake.users.get('502171534543028237').send('Я работаю.');
} );