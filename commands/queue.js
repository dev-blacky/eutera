const Discord = require('discord.js');

module.exports = {
    name: 'queue',
    aliases: ['q'],
    category: 'music',
    async execute (message, args) {
        const sQueue = message.client.queue.get(message.guild.id);
            if(!sQueue)
                return message.reply("there is nothing playing");        

        let currentPage = 0;
        const embeds = generator(sQueue);

        const queueEmbed = await message.channel.send(`Queue page: ${currentPage+1}/${embeds.length}`, embeds[currentPage])
            await queueEmbed.react('⬅️');
            await queueEmbed.react('➡️');

        const reactionFilter = (reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && (message.author.id === user.id)
        const collector = queueEmbed.createReactionCollector(reactionFilter);

        collector.on('collect', (reaction, user) => {
            if(reaction.emoji.name === '➡️'){
                if(currentPage < embeds.length-1){
                    currentPage+=1;
                    queueEmbed.edit(`Lyrics page: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
                    message.reactions.resolve(reaction).users.remove(user);
                }
            } else if(reaction.emoji.name === '⬅️') {
                if(currentPage !== 0){
                    currentPage-=1;
                    queueEmbed.edit(`Lyrics page: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
                    message.reactions.resolve(reaction).users.remove(user);
                }
            };
        });

        message.channel.send(`**Now Playing:** \`${sQueue.songs[0].title}\``, {split: true});
    }
};

function generator(sQueue){
    const embeds = [];
    let songs = 10;
    for (let l = 0; l < sQueue.songs.length; l += 10) {
        const current = sQueue.songs.slice(l, songs);
        songs += 10;
        let j = l;
        const info = current.map(song => `${++j}. [${song.title}](${song.url})`).join('\n');
        const msg = new Discord.MessageEmbed()
            .setDescription(`${info}`).setTitle('QUEUE').setAuthor('Eutera').setTimestamp();
        embeds.push(msg);
    };
    return embeds;
}