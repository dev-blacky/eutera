const Discord = require('discord.js');

const info = require('../core/info.json');
const config = require('../core/config.json');
const catalog = require('../core/catalog.json');

module.exports = {
    name: 'help',
    aliasses: ['h'],
    execute(message) {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${info.name}: ${info.version}`)
            .setTitle(`WELCOME TO ${info.name}:`)
            .setThumbnail('https://i.imgur.com/98PAawR.png')
            .setDescription('All the commands of Eutera will be listed and categorized bellow for you. ' +
            'Don\'t forget to check the' + ' ' + `"${config.prefix}${catalog.patch}"` + ' ' + 'command to see what\'s new!')
            .addFields(
                {
                    name: '\u200B', 
                    value: '\u200B'
                },
                {
                    name: '__MODERATION:__', 
                    value: `${config.prefix}${catalog.clear}, ${config.prefix}${catalog.kick}, ${config.prefix}${catalog.ban}, ${config.prefix}${catalog.unban}`,
                    inline: true
                },
                {
                    name: 'NOTE:',
                    value: 'Those are some basic commands to help with moderation.'
                },
                {
                    name: '\u200B', 
                    value: '\u200B'
                },
                {
                    name: '__MUSIC:__', 
                    value: `${config.prefix}${catalog.play}, ${config.prefix}${catalog.stop}, ${config.prefix}${catalog.pause}, ${config.prefix}${catalog.resume}, ${config.prefix}${catalog.skip}, 
                            ${config.prefix}${catalog.shuffle}, ${config.prefix}${catalog.volume}, ${config.prefix}${catalog.queue}, ${config.prefix}${catalog.remove}, ${config.prefix}${catalog.now}, ${config.prefix}${catalog.lyrics}`,
                    inline: true
                },
                {
                    name: 'NOTE:',
                    value: 'So this might be a little bit tricky so I\'m gonna explain it. The "remove" command will remove a specific song from the queue, ' + 
                    'while the skip command skips the song that\'s currently playing or a specified bunch of songs starting with the one that\'s next in the queue. ' +
                    'Now let\'s continue!'
                },
                {
                    name: '\u200B', 
                    value: '\u200B'
                },
                {
                    name: '__OTHER:__',
                    value: `${config.prefix}${catalog.meme}, ${config.prefix}${catalog.pool}, ${config.prefix}${catalog.ping}, ${config.prefix}${catalog.patch}`
                },
                {
                    name: 'NOTE:',
                    value: 'If you want a meme or you just want to create a pool these are the commands for you. I hope I managed to help you find what you were looking for.'
                }
            )
            .setFooter('by Whiteline.')
            .setTimestamp();
            message.channel.send(embed).catch(console.error);
    }
};