const bar = require("string-progressbar");
const Discord = require("discord.js");

module.exports = {
    name: 'now',
    aliases: ['n'],
    category: 'music',
    execute (message) {
        const serverQueue = message.client.queue.get(message.guild.id);
            if(!serverQueue)
                return message.reply("there is nothing playing");

        const song = serverQueue.songs[0];
        const seek = (serverQueue.connection.dispatcher.streamTime - serverQueue.connection.dispatcher.pausedTime) / 1000;
        const left = song.duration - seek;

        let now = new Discord.MessageEmbed()
            .setTitle('NOW PLAYING')
            .setDescription(`${song.title}`)
            .setColor("#F8AA2A")
            .setAuthor(message.client.user.username);

        if (song.duration > 0) {
            now.addField("\u200b", new Date(seek * 1000).toISOString().substr(11, 8) +
                " [ " + bar(song.duration == 0 ? seek : song.duration, seek, 20)[0] + " ] " +
                (song.duration == 0 ? "LIVE" : new Date (song.duration * 1000).toISOString().substr(11,8)),
            false);
            now.setFooter("REMAINING: " + new Date(left * 1000).toISOString().substr(11, 8));
        };
        return message.channel.send(now);
    }
};