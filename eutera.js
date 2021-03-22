/* Client */
const dclient = require('./core/client');
const client = new dclient();

/* Core */
const config = require('./core/config.json');
const info = require('./core/info.json');

/* Required */
const { Collection, Message } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(join(__dirname, 'commands', `${file}`));
    client.commands.set(command.name, command);
    console.log(`${info.name} is loading: ${command.name}.js`);
};

client.once('ready', async () => {
    console.log(`${info.name} ` + info.version + ' ' + `is now online and running on Vultr (Ubuntu 20.10)!`);
    client.user.setActivity(`${config.prefix}help`, {type: 'LISTENING'}).catch(console.error);
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) 
        return;
    
    // command related consts.
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); 

    if (!command) 
        return;

    if (command.args && !args.length) {
        let reply = `${message.author}, you did not provide any arguments!`;
        if (command.usage) reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
        return message.channel.send(reply);
    };

    try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!')
    };
});

/* Login the bot */
client.login(config.token);