const Discord = require('discord.js');
const {prefix, roleToRule} = require('./config.json');
const lake = new Discord.Client();

const playlist = new Map();

lake.on('ready', () => { console.log(`Lake has been launched`) });

lake.on('message', msg => {
    //check whether member has a role
    if(!msg.member.roles.find(r => r.name === roleToRule)) return;

    const [command, ...args] = msg.content.split(' ');
    if(!command.startsWith(prefix) || command.indexOf(prefix) !== command.lastIndexOf(prefix) || msg.author.bot) return;
    if(!msg.member.voiceChannel && command !== 'lv') return msg.reply('Join any channel first!');

    const queue = playlist.get(msg.guild.id) || {volume: 10, songs: [] };
    try {
        let commandFile = require(`./commands/${command.toLowerCase().substring(1)}.js`);
        
        commandFile.run(msg, args, queue, playlist);
    } catch(e) {
        msg.reply('Unknown command');
        console.log(e);
    }
});

lake.login(process.env.BOT_TOKEN);
