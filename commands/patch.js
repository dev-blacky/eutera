const Discord = require('discord.js');
const info = require('../core/info.json');

module.exports = {
    name: 'patch',
    category: 'Debug',
    description: 'This command displays the most recent patch of the bot!',
    execute (message) {
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`${info.name}: ${info.version}`)
            .setDescription('PATCH NOTES:')
            .addField('● GENERAL:', 'Added the remove command and the ability to skip more songs at once!')
            .addField('● OTHER TWEAKS:', 'Changed the queue limit to 2800 songs!')
            .setTimestamp();
            message.channel.send(embed).catch(console.error);
    }
};