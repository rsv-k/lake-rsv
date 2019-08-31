exports.run = (msg, args) => {
    if (msg.guild.id !== '611111608219074570' || !args[0]) return;

    const requestedRole = args.join(' ');

    msg.guild.roles.find(role => {
        if (getWords(role.name) === requestedRole) {

            let members = '';
            let counter = 1;
            role.members.forEach(member => {
                members += `${counter}. ${member.user.username}` + '\n';
                counter++;
            });

            msg.channel.send(members);
        }
    });
}

function getWords(name) {
    const role = name.split('');

    let word = '';
    for (let i = 0; i < role.length; i++) {
        if (role[i].match(/[а-яёa-z\d\s]/i)) word += name[i];
    }

    return word.trim();
}