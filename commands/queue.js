const config = require("../core/config.json");
const Discord = require('discord.js');

module.exports = {
    name: 'queue',
    aliases: ['q'],
    category: 'music',
    execute (message) {
        const vChannel = message.member.voice.channel;
        const serverQueue = message.client.queue.get(message.guild.id);
            if(!serverQueue)
                return message.reply("there is nothing playing");

        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setTitle(`QUEUE`)
            .setDescription(serverQueue.songs.map((song, index) => `${index + 1}. ${song.title}`))
            .setTimestamp();

        if (embed.description.length >= 2048)
            embed.description = embed.description.substr(0, 2007) + "\nQueue larger than character limit...";

        message.channel.send(embed).catch(console.error);
        message.channel.send(`**Now Playing:** ${serverQueue.songs[0].title} in the ${vChannel} channel!`, {split: true});
    }
};