module.exports = {
    name: 'kick',
    aliases: ['k'],
    execute(message, args){
        if(message.member.permissions.has("KICK_MEMBERS")) {
            const user = message.mentions.members.first();

            if(user){
                const member = message.guild.member(user);

                if(member){
                    member.kick('kick_reason')
                        .then(() => console.log(`${message.author.tag} kicked ${user.tag} from ${message.guild.name}`))
                        .catch(console.error);
                    message.reply(`successfully kicked ${user.tag}`);
                } else {
                    message.reply(`the provided user is not a member of ${message.guild.name}!`)
                };
            } else {
                    message.reply('you have not provided a user!');
            };
        };
    }
};