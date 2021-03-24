const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    execute(message, args){
        user = message.mentions.users.first();
        if(message.member.permissions.has("BAN_MEMBERS") || message.member.permissions.has("ADMINISTRATOR")) {
            if (user){
                message.guild.members.ban(user.id)
                    .then(() => console.log(`${message.author.tag} banned ${user.tag} from ${message.guild.name}`))
                    .catch(console.error);
                message.reply(`${message.author.tag} banned ${user.tag} from ${message.guild.name}`);
            } else {
                message.reply('a user has not been provided!');
            };
        };
    }
};