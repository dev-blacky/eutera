const Volume = require('../schemas/volumeSchema');

module.exports = {
    name: 'volume',
    aliases: ['v'],
    category: 'music',
    execute (message, args) {
        const volume = args[0];

        if (!volume)
            return message.channel.send(`\`${message.author.username}\`` + ' ' + 'the volume is currently at' + ' ' + `${serverQueue.volume}%!`);

        const vChannel = message.member.voice.channel;
            if(!vChannel)
                return message.reply("you need to be in a voice channel to change the volume!");

        const sQueue = message.client.queue.get(message.guild.id);
            if(!sQueue)
                return message.reply("there is nothing playing!");

        const result = await Volume.findOne({
            guildID: message.guild.id
        });

        if (result) {
            result.volume = volume;
            result.save();

            message.channel.send(`\`${message.author.username}\`` + ' ' + 'the volume is now at:' + ' ' + `\`${volume}%\``);
        } else if (!result) {
            const data = new Volume({
                guildID: message.guild.id,
                volume: volume
            });

            data.save();
            message.channel.send(`\`${message.author.username}\`` + ' ' + 'the volume is now at:' + ' ' + `\`${volume}%\``);
        };
    }
};