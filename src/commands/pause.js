module.exports = {
    name: 'pause',
    category: 'Music',
    execute (message, args) {
        const voiceChannel = message.member.voice.channel;
            if(!voiceChannel)
                return message.reply("you need to be in a voice channel to skip the music!");

        const serverQueue = message.client.queue.get(message.guild.id);
            if(!serverQueue)
                return message.reply("there is nothing playing!");
            if(!serverQueue.playing)
                return message.reply("the music is already paused!");

        serverQueue.playing = false;
        serverQueue.connection.dispatcher.pause();

        message.channel.send(`${message.author}, I have now paused the music for you!`);
    }
};