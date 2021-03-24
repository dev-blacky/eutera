module.exports = {
    name: 'resume',
    category: 'Music',
    execute (message, args) {
        const voiceChannel = message.member.voice.channel;
            if(!voiceChannel)
                return message.reply("you need to be in a voice channel to skip the music!");
                
        const serverQueue = message.client.queue.get(message.guild.id);
            if(!serverQueue)
                return message.reply("there is nothing playing!");
            if(serverQueue.playing) 
                return message.reply("the music is already playing!");

        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        message.channel.send(`\`${message.author.username}\`, I have now resumed the music for you!`);
    }
}