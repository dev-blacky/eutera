const Discord = require('discord.js');
const info = require('../core/info.json');

module.exports = {
    name: 'patch',
    category: 'Debug',
    description: 'This command displays the most recent patch of the bot!',
    execute (message) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${info.name}: ${info.version}`)
            .setTitle('PATCH NOTES:')
            .setThumbnail('https://i.imgur.com/98PAawR.png')
            .setDescription('integrated Eutera with the database for future updates.')
            .setFooter('by Whiteline.')
            .setTimestamp();
            message.channel.send(embed).catch(console.error);
    }
};