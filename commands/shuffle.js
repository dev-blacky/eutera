module.exports = {
    name: 'shuffle',
    execute(message) {
        const sQueue = message.client.queue.get(message.guild.id);
        const vChannel = message.member.voice.channel;
        if(!sQueue)
            return message.reply('there is nothing playing!');

        let song = sQueue.songs;
        for(let l = song.length -1; l > 1; l--) {
            let r = 1 + Math.floor(Math.random() * l);
            [song[l], song[r]] = [song[r], song[l]];
        }
        sQueue.songs = song;
        message.client.queue.set(message.guild.id, sQueue);
        message.channel.send(`\`${message.author.username}\` shuffled the queue in ${vChannel}!`);
    }
}