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


















const Discord = require('discord.js');
const lake = new Discord.Client();
const { prefix } = require('./config.json');



lake.on('message', async (msg) => {
    if (msg.author.bot || !msg.guild) return;

    const text = msg.content.toLowerCase();

    if (text.includes('lago') || text.includes('лаго')) return putLagoReactions(msg);
    
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

    if (msg.content === '1' && msg.author.id === '481189853241802792') msg.delete();

    const [command, ...args] = msg.content.split(' ');
    
    if (!command.startsWith(prefix) || command.indexOf(prefix) !== command.lastIndexOf(prefix)) return;
    
    try {
        const commandFile = require(`./commands/${command.toLowerCase().substring(2)}.js`);

        commandFile.run(msg, args);
    }
    catch (err) { console.log(command) }
});




const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

lake.on('messageReactionAdd', (reaction, user) => {
    let counter = reaction.count;
    console.log('added: ' + counter);
    const msg = reaction.message;
    
    if (counter === 3) {
        const chosen = lake.channels.get('613727337627779083');
        
        chosen.send({
            embed: {
                color: 3447003,
                author: {
                    name: msg.author.username,
                    icon_url: msg.author.avatarURL
                },
                description: msg.content,
                fields: [{
                    name: 'Source',
                    value: `[link](${msg.url})`
                }],
                timestamp: msg.createdAt,
                footer: {
                    text: msg.id
                }
            }
        });
    }
});


lake.on('messageReactionRemove', async (reaction, user) => {
    let counter = reaction.count;
    console.log('deleted: ' + counter);
    const msg = reaction.message;

    if (counter < 3) {
        const chosen = lake.channels.get('613727337627779083');

        const messages = await chosen.fetchMessages();

        messages.forEach(message => {
            if (message.author.username === 'Lake' && message.embeds.find(embed => embed.footer.text === msg.id )) {
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
        console.log('I am cached');
        return;
    }
    console.log('I am not cached');

    channel.fetchMessage(data.message_id).then(msg => {
        const emoji = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
        const reaction = msg.reactions.get(emoji);
        
        if (reaction) reaction.users.set(data.user_id, lake.users.get(data.user_id));

        if (e.t === 'MESSAGE_REACTION_ADD') {
            console.log('emoji added');
            lake.emit('messageReactionAdd', reaction, lake.users.get(data.user_id));
        }
        else if (e.t === 'MESSAGE_REACTION_ADD') {
            console.log('emoji deleted');
            return lake.emit('messageReactionRemove', reaction, lake.users.get(data.user_id));
        }
    });
})





function putLagoReactions(msg) {
    let reaction = random(30) === 7 ? 'lagotired' : 'lago';
    if (random(100) === 7) reaction = 'lagoscared';

    return addReaction(msg, reaction);
}
function addReaction(msg, reaction) {
    const emoji = lake.guilds.get('565647445758050304').emojis.find(emoji => emoji.name === reaction);
    msg.react(emoji.id);
}

function random(max) {
    return Math.floor(Math.random() * max);
}

lake.login(process.env.TOKEN);
lake.on('ready', () => console.log(`Ready to work`) );