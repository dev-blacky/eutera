module.exports = {
    name: 'remove',
    aliases: ['rm'],
    category: 'music',
    execute (message, args) {
        if(!args[0]) {
            message.channel.send(`\`${message.author.username}\` please specify the queue number.`);
        } else {
            const voiceChannel = message.member.voice.channel;
            if(!voiceChannel)
                return message.reply("you need to be in a voice channel to skip the music!");

            const serverQueue = message.client.queue.get(message.guild.id);
            if (!serverQueue) 
                return message.reply(`there is nothing in the queue!`).catch(console.error);

            if (!args.length) 
                return message.reply('please specify the queue number!').catch(console.error);

            const song = serverQueue.songs.splice(args[0] - 1, 1);
            serverQueue.textChannel.send(`**${song[0].title}** was removed from the queue \`${message.author.username}\``);
        };
    }
};