module.exports = {
    name: 'ping',
    aliases: ['pi'],
    category: 'debug',
    execute (message) {
        message.reply(`Average ping: ${Math.round(message.client.ws.ping)} ms`).catch(console.error);
    }
};