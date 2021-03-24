module.exports = {
    name: 'stop',
    aliases: ['st'],
    category: 'music',
    execute (message, args) {
        const voiceChannel = message.member.voice.channel;
            if(!voiceChannel)
                return message.reply("you need to be in a voice channel to stop the music!");
                
        const serverQueue = message.client.queue.get(message.guild.id);
            if(!serverQueue) 
                return message.reply('there is nothing playing that I could stop for you.');

        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        message.channel.send(`\`${message.author.username}\`, stoped the music!`);
    }
};