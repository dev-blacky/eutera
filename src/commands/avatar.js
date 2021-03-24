const Discord = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['a'],
    execute (message, args) {
        let embed = new Discord.MessageEmbed();
        if(!message.mentions.members.first()) {
            embed.setColor(`RANDOM`);
            embed.setTitle(`The amazing avatar of ${message.author.tag}!`);
            embed.setImage(message.author.displayAvatarURL(
                { size: 512 }
            ));

            return message.channel.send(embed).catch(console.error);
        } else {
            const user = message.mentions.users.first();

            embed.setColor(`RANDOM`);
            embed.setTitle(`${user.tag}'s avatar!`);
            embed.setImage(user.displayAvatarURL(
                { size: 512 }
            ));

            return message.channel.send(embed).catch(console.error);
        };
    }
};