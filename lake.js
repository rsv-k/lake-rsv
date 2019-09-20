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
    
    
    if (msg.channel.type === 'text' && msg.channel.name.toLowerCase().includes('голосование')) {
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
    else if (msg.channel.id === '611302025279438888' && msg.author.id === '315926021457051650' &&
    msg.embeds[0] && msg.embeds[0].description.includes('Server bumped by')) {
        clearTimeout(flag.reminder);
        
        flag.reminder = setTimeout(bump, 4 * 60 * 60 * 1000);
    }












    
    const [command, ...args] = msg.content.split(' ');
    if (!command.startsWith(prefix) || command.indexOf(prefix) !== command.lastIndexOf(prefix)) return;
    
    try {
        const commandFile = require(`./commands/${command.toLowerCase().substring(2)}`);
        commandFile.run(msg, args, guildMusic);
    }
    catch (err) { console.error(err) }
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
    let newUserChannel = newMember.voiceChannel;
    let oldUserChannel = oldMember.voiceChannel;
    
    if (oldUserChannel === undefined && newUserChannel !== undefined) {
        if (!newMember.user.bot && newUserChannel.parentID !== '615290496918749187') {
            if (newMember.guild.id === '611111608219074570') newMember.addRole('614970662020317339');

            if (newUserChannel.members.some(m => m.id === lake.user.id)) {
                clearTimeout(flag[newUserChannel.guild.id]);
            }
        }
    }
    else if (newUserChannel === undefined) {
        if (oldMember.guild.id === '611111608219074570') oldMember.removeRole('614970662020317339');

        if (oldUserChannel.members.some(m => m.id === lake.user.id) && oldUserChannel.members.size === 1) {
            flag[oldUserChannel.guild.id] = setTimeout(() => {
                oldUserChannel.guild.voiceConnection.disconnect();
                guildMusic.delete(oldUserChannel.guild.id);
            }, 5 * 60 * 1000);
        }
        
    }
});

function bump() {
    const channel = lake.channels.get('611302025279438888');
    
    channel.send('<@&613799917718077450> бампаем (!bump и s.up)');
}

lake.login(process.env.TOKEN);
lake.on('ready', async () => {
    console.log('Ready');
    lake.user.setActivity('--help', {type: 'LISTENING'});

    const channel = lake.channels.get('611302025279438888');
    const messages = await channel.fetchMessages({limit: 100});

    messages.find(m => {
        if (m.author.id === '315926021457051650' && m.embeds[0] && m.embeds[0].description.includes('Server bumped by')) {
            
            const time = 4 *  60 * 60 * 1000 - (new Date() - m.createdAt);
            
            flag.reminder = setTimeout(bump, time);
            return m;
        }
    });
} );