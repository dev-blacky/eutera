module.exports = {
    name: 'restart',
    category: 'Debug',
    description: 'This command shuts down the bot!',
    async execute (message, args) {
        try {
            await message.reply('I am restarting!');
            process.exit();} 
            catch (error) {await message.channel.send(`ERR0R: ${error.message}!`);
        };
    }
}; 