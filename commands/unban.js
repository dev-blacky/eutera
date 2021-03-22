module.exports = {
    name: 'unban',
    execute(message, args){
        if(message.member.permissions.has("BAN_MEMBERS") || message.member.permissions.has("ADMINISTRATOR")) {
            let userID = args[0];
            
            if (args[0]){
                message.guild.fetchBans()
                    .then(bans => {
                        if(bans.size == 0) return message.reply(`${message.guild.name} does not have anyone banned!`);
                        let bUser = bans.find(b => b.user.id == userID);
                        if(!bUser) return message.reply("the userID that you provided is not banned. ");

                        message.guild.members.unban(bUser.user)
                            .then(() => console.log(`${message.author.tag} unbanned ${args[0]} from ${message.guild.name}`))
                            .catch(error => {
                                console.error(error);
                                return message.reply(`something went wrong while I was trying to unban ${args[0]}!`);
                            }).then(() => {
                                message.reply(`successfully unbanned ${args[0]}`);
                            });
                     });        
            } else {
                message.reply('ERR0R: You have not provided a user!');
            };
        };
    }
};