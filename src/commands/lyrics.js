const Discord = require('discord.js');
const lyricsFinder = require("lyrics-finder");

module.exports = {
    name: 'lyrics',
    aliases: ['ly'],
    category: 'music',
    async execute (message, args) {
        if(!args[0]) {
            const serverQueue = message.client.queue.get(message.guild.id);
            if(!serverQueue) return message.reply("there\'s nothing playing!").catch(console.error);

            songName = serverQueue.songs[0].title;

            songName = songName.replace(/ *\([^)]*\) */g, '');
    
            songName = songName.replace(
                /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
            '');

            let lyrics = null;

            lyrics = await lyricsFinder(songName, "");
            if(!lyrics) 
                lyrics = `I couldn't find any lyrics for ${songName}!`;

            let lyricsEmbed = new Discord.MessageEmbed()
                .setTitle(`${songName} - Lyrics`)
                .setDescription(lyrics)
                .setColor("#F8AA2A")
                .setTimestamp();

            if(lyricsEmbed.description.length >= 2048)
                lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2048)}`;
                return message.channel.send(lyricsEmbed).catch(console.error);
        } else {
            const search = args.join(" ");
            let lyrics = null;
        
            lyrics = await lyricsFinder(search, "");
            if(!lyrics) 
                lyrics = `I couldn't find any lyrics for ${search}!`;

            let lyricsEmbed = new Discord.MessageEmbed()
                .setTitle(`${search} - Lyrics`)
                .setDescription(lyrics)
                .setColor("#F8AA2A")
                .setTimestamp();

            if(lyricsEmbed.description.length >= 2048)
                lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2048)}`;
                return message.channel.send(lyricsEmbed).catch(console.error);
        };
    }
};