const { Guild } = require("discord.js");

module.exports = {
    name: 'clear',
    aliases: ['cl'],
    async execute(message, args) {
        if (!args[0])
            return message.reply('please provide a number of messages!');
        if (isNaN(args[0]))
            return message.reply('please provide a real number!');

        if(args[0] > 100)
            return message.reply('I can\'t delete more than 100 messages');
        if(args[0] < 1)
            return message.reply('you have to delete at least one message!');

        await message.channel.messages.fetch({limit: args[0]})
            .then(messages => {
                message.channel.bulkDelete(args[0]);
            }).catch(console.error);
    }
};