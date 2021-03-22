module.exports = {
    name: 'volume',
    aliases: ['v'],
    category: 'music',
    execute (message, args) {
        if(!args[0]) {                  
            const sQueue = message.client.queue.get(message.guild.id);    
            message.channel.send(`\`${message.author.username}\`, the volume is currently at: \`${sQueue.volume}%\``);
        } else {
            const vChannel = message.member.voice.channel;
                if(!vChannel)
                    return message.reply("you need to be in a voice channel to change the volume!");

            const sQueue = message.client.queue.get(message.guild.id);
                if(!sQueue)
                    return message.reply("there is nothing playing!");

            sQueue.volume = args[0];
            sQueue.connection.dispatcher.setVolume(sQueue.volume / 100);
            message.channel.send(`\`${message.author.username}\`, the volume is now at: \`${sQueue.volume}%\``);
        };
    }
};