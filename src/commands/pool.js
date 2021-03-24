module.exports = {
    name: 'pool',
    aliases: ['po'],
    usage: '<question>',
    execute (message, args) {
        if (!args[0]) {
            message.reply('please ask a question!')
        } else {
            let messageArgs = args.slice(0).join(" ");

            message.channel.send(':notepad_spiral: ' + '**' + messageArgs + '**').then(messageReaction => {
                messageReaction.react("👍");
                messageReaction.react("👎")});
        };
    }
};