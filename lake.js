const http = require('http');
const express = require('express');
const app = express();
app.get('/', (req, res) => {
    console.log(Date.now() + ' Ping Recieved');
    res.sendStatus(200);
});

app.listen(process.env.PORT);
setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`)
}, 280000);




require('dotenv').config();
const Discord = require('discord.js');
const lake = new Discord.Client();

const { prefix } = require('./config.json');
const guildMusic = new Map();
const flag = {
    reminder: null,
}

lake.on('message', async (msg) => {
    if (!msg.guild || msg.author.bot) return;
    
    const [command, ...args] = msg.content.split(' ');
    if (!command.startsWith(prefix) || command.indexOf(prefix) !== command.lastIndexOf(prefix)) return;
    
    try {
        const commandFile = require(`./commands/${command.toLowerCase().substring(2)}`);
        commandFile.run(msg, args, guildMusic);
    }
    catch (err) { console.error('Uknown command: ' + msg.content) }
});


const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

lake.on('messageReactionAdd', (reaction, user) => {
    if (reaction.emoji.id !== '614764513001996288') return;
    let counter = reaction.count;
    
    const msg = reaction.message;
    
    if (counter === 3) {
        const chosen = lake.channels.get('613727337627779083');
        const embed = {
                color: 3447003,
                author: {
                    name: msg.author.username,
                    icon_url: msg.author.avatarURL
                },
                description: msg.content,
                image: {
                    url: ''
                },
                fields: [{
                    name: 'Source',
                    value: `[link](${msg.url})`
                }],
                timestamp: msg.createdAt,
                footer: {
                    text: msg.id
                }
        }

        if (msg.attachments.size > 0) {
            const images = [];
            msg.attachments.every(attach => images.push(attach.url));
            for (let i = 0; i < images.length; i++) {
                if (i === 1) embed.description = '';
                
                embed.image.url = images[i];
                chosen.send({ embed });
            }

            return;
        }

        if (msg.content.toLowerCase().includes('png') || msg.content.toLowerCase().includes('img')) {
            embed.image.url = msg.content;
            embed.description = '';
        }
        
        chosen.send({ embed });
    }
});

lake.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.emoji.id !== '614764513001996288') return;
    let counter = reaction.count;
    
    const msg = reaction.message;

    if (counter < 3) {
        const chosen = lake.channels.get('613727337627779083');

        const messages = await chosen.fetchMessages();

        messages.forEach(message => {
            if (message.embeds.find(embed => embed.footer.text === msg.id )) {
                message.delete();
            }
        });
    }

});

lake.on('raw', async e => {
    if (!events.hasOwnProperty(e.t)) return;

    const { d: data } = e;
    const channel = lake.channels.get(data.channel_id);
    
    if (channel.messages.has(data.message_id)) {
        return;
    }

    channel.fetchMessage(data.message_id).then(msg => {
        const emoji = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
        
        const reaction = msg.reactions.get(emoji);
        
        if (reaction) reaction.users.set(data.user_id, lake.users.get(data.user_id));

        if (e.t === 'MESSAGE_REACTION_ADD') {
            lake.emit('messageReactionAdd', reaction, lake.users.get(data.user_id));
        }
        else if (e.t === 'MESSAGE_REACTION_REMOVE') {
            lake.emit('messageReactionRemove', reaction, lake.users.get(data.user_id));
        }
    });
})

lake.on('voiceStateUpdate', (oldMember, newMember) => {
    const newUserChannel = newMember.voiceChannel;
    const oldUserChannel = oldMember.voiceChannel;
    
    if (oldMember.guild.id !== '611111608219074570' || newMember.user.bot || newMember.roles.get('615484787993608202')) return;
    
    if (oldUserChannel === undefined && newUserChannel !== undefined) {
        newMember.addRole('614970662020317339');

        if (newUserChannel.members.get(lake.user.id)) {
            clearTimeout(flag[newUserChannel.guild.id]);
        }
    }
    else if (newUserChannel === undefined) {
        oldMember.removeRole('614970662020317339');

        if (oldUserChannel.members.get(lake.user.id) && oldUserChannel.members.size === 1) {

            flag[oldUserChannel.guild.id] = setTimeout(() => {
                oldUserChannel.guild.voiceConnection.disconnect();
                guildMusic.delete(oldUserChannel.guild.id);
            }, 5 * 60 * 1000);
        }
        
    }
});

lake.login(process.env.TOKEN);
lake.on('ready', async () => {
    console.log('Ready');
    lake.user.setActivity('--help', {type: 'LISTENING'});
} );