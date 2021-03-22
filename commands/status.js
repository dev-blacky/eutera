const Discord = require('discord.js');
const info = require('../core/info.json');

module.exports = {
    name: 'status',
    aliasses: ['s'],
    execute(message) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${info.name}`)
            .setTitle('STATUS')
            .setThumbnail('https://i.imgur.com/98PAawR.png')
            .setColor(0xF1C40F)
            .setDescription(`\`${info.name}\` version: \`${info.version}\` is online & running on \`${info.host}\` with ping: \`${Math.round(message.client.ws.ping)}ms\`.`)
            message.channel.send(embed).catch(console.error);
            console.log('SYSTEM:' + ' ' + `A status request was called by ${message.author.username} in ${message.guild.name}`);
    }
};