const Discord = require('discord.js');
const lake = new Discord.Client();

lake.on('ready', () => { console.log(`Lake has been launched`) });
lake.on('message', async (msg) => {
    if(!msg.guild || msg.author.bot) return;
    const text = msg.content.toLowerCase();
    if (Math.floor(Math.random() * 300) === 7) return addReaction(msg, 'lago');
    
    if (text.includes('lago') || text.includes('лаго')) {
        let reaction = 'lago';
        if (Math.floor(Math.random() * 30) === 7) reaction = 'lagotired';
        else if (Math.floor(Math.random() * 100) === 7) rection = 'lagoscared';
        return addReaction(msg, reaction);
    }

    if (msg.channel.name.toLowerCase().includes('голосование')) {
        const numbers = msg.content.match(/\d+./g);
        if (!numbers || !msg.content.toLowerCase().includes('темы')) return;
        
        const lastNumber = parseInt(numbers[numbers.length - 1]);
        const emojiNumbers = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣'];

        for(let i = 0; i < lastNumber; i++) {
            await msg.react(`${emojiNumbers[i]}`);
        }
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
lake.login(process.env.TOKEN);