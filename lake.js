const Discord = require('discord.js');
const lake = new Discord.Client();

lake.on('ready', () => { console.log(`Lake has been launched`) });
lake.on('message', msg => {
    if(!msg.guild || msg.author.bot) return;
    const text = msg.content.toLowerCase();
    if (text.includes('lago') || text.includes('лаго')) {
        let reaction = 'lago';
        if (Math.floor(Math.random() * 30) === 7) reaction = 'lagotired';
        if (Math.floor(Math.random() * 100) === 7) reaction = 'lagoscared';
        const lago = lake.guilds.get('565647445758050304').emojis.find(emoji => emoji.name === reaction);
        msg.react(lago.id);
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
lake.login(process.env.TOKEN);