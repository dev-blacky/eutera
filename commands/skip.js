module.exports = {
    name: 'skip',
    aliases: ['sk'],
    category: 'music',
    execute (message, args) {
        if(!args[0]) {
            const voiceChannel = message.member.voice.channel;
            if(!voiceChannel)
                return message.reply("you need to be in a voice channel to skip the music!");
                
            const serverQueue = message.client.queue.get(message.guild.id);
                if(!serverQueue)
                    return message.reply("there is nothing playing!");

            songName = serverQueue.songs[0].title;

            serverQueue.connection.dispatcher.end();
            message.channel.send(`**${songName}** was skipped by \`${message.author.username}\``);
        } else {
            const voiceChannel = message.member.voice.channel;
            if(!voiceChannel)
                return message.reply("you need to be in a voice channel to skip the music!");

            const serverQueue = message.client.queue.get(message.guild.id);
            if (!serverQueue) 
                return message.reply(`there is nothing in the queue!`).catch(console.error);

            if (!args.length) 
                return message.reply('please specify the queue number!').catch(console.error);

            const song = serverQueue.songs.splice(1, args[0]);
            serverQueue.textChannel.send(`\`${message.author.username}\`` + ' removed ' + `${args[0]}` + ' songs.');
        };
    }
};