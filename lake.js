const Discord = require('discord.js');

const lake = new Discord.Client();


lake.on('ready', () => { console.log(`Lake has been launched`) });
lake.on('message', msg => {
    if(!msg.guild || msg.author.bot) return;
    const text = msg.content.toLowerCase();

    if (text.includes('lago') || text.includes('лаго')) {
        const lago = lake.emojis.find(emoji => emoji.name === 'lago');
        
        msg.react(lago.id);
    }
})

lake.login(process.env.TOKEN || require('./token.json').token);