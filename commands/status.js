const Discord = require('discord.js');
const info = require('../core/info.json');

module.exports = {
    name: 'status',
    aliasses: ['s'],
    execute(message) {
        const embed = new Discord.MessageEmbed()
            .setTitle('EUTERA: STATUS')
            .setColor(0xF1C40F)
            .addField('● VERSION: ', `${info.version}`)
            .addField('● BUILD: ', `${info.build}`)
            .addField('● HOST: ', `${info.host}`);
            message.channel.send(embed).catch(console.error);
    }
};