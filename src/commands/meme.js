const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: 'meme',
    execute (message) {
        fetch('https://meme-api.herokuapp.com/gimme')
            .then(res => res.json())
            .then(json => {
                let embed = new Discord.MessageEmbed()
                    .setTitle(json.title)
                    .setImage(json.url)
                    .setFooter(`Link: ${json.postLink} | Subreddit: ${json.subreddit}`)
                message.channel.send(embed);
            }
        );
    }
};