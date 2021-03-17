const Discord = require('discord.js');
const config = require('../core/config.json');
const catalog = require('../core/catalog.json');

module.exports = {
    name: 'help',
    aliasses: ['h'],
    execute(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('COMMANDS:')
            .setColor(0xF1C40F)
            .addField('● MAIN: ', `${config.prefix}${catalog.meme}, ${config.prefix}${catalog.pool}, ${config.prefix}${catalog.ping}, ${config.prefix}${catalog.patch}`)
            .addField('● MUSIC: ', `${config.prefix}${catalog.play}, ${config.prefix}${catalog.stop}, ${config.prefix}${catalog.pause}, ${config.prefix}${catalog.resume}, ${config.prefix}${catalog.skip}, 
            ${config.prefix}${catalog.queue}, ${config.prefix}${catalog.remove}, ${config.prefix}${catalog.now}, ${config.prefix}${catalog.lyrics}`)
            .addField('● ADMIN: ', `${config.prefix}${catalog.clear}, ${config.prefix}${catalog.kick}, ${config.prefix}${catalog.ban}, ${config.prefix}${catalog.unban}`);
            message.channel.send(embed).catch(console.error);
    }
};