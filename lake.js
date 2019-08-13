const Discord = require('discord.js');
const {prefix, roleToRule} = require('./config.json');
const lake = new Discord.Client();

const playlist = new Map();

lake.on('ready', () => { console.log(`Lake has been launched`) });

lake.on('message', msg => {

    // console.log(msg.guild.voiceConnection);
    //check whether member has a role
    if( !msg.guild || !msg.member.roles.find(r => r.name === roleToRule)) return;
    const [command, ...args] = msg.content.split(' ');

    if(!command.startsWith(prefix) || command.indexOf(prefix) !== command.lastIndexOf(prefix) || msg.author.bot) return;
    if(!msg.member.voiceChannel && command !== '-lv') return msg.reply('Join any channel first!');
    const queue = playlist.get(msg.guild.id) || {volume: 3, songs: [] };

    try {
        let commandFile = require(`./commands/${command.toLowerCase().substring(1)}.js`);
        
        commandFile.run(msg, args, queue, playlist);
        msg.delete();
    } catch(e) { console.log(e) }
});

lake.login(process.env.TOKEN);
