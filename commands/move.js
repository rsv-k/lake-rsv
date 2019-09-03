exports.run = async (msg, args) => {
    if((!msg.member.roles.find(role => role.name === 'Цензор' || role.name === 'Редактор'))) return;
    if (args.length !== 3 || args[1] !== 'to' || !args[0] || !args[2] || msg.author.id !== '481189853241802792') return;
    
    const from = await isPossibleToMove(msg, args[0]);
    const to = await isPossibleToMove(msg, args[2]);
    
    if (!from || !to) return;
    from.members.forEach(member => member.setVoiceChannel(to.id) );
}

async function isPossibleToMove(msg, name) {
    return await msg.guild.channels.find(channel =>  channel.type === 'voice' && getWords(channel.name) === name );
}

function getWords(name) {
    name = name.split('');

    let word = '';
    for (let i = 0; i < name.length; i++) {
        if (name[i].match(/[а-яёa-z\d-\s]/)) word += name[i];
    }

    return word;
}