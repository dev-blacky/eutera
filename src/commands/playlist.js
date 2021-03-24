const config = require('../core/config.json');
const Discord = require ('discord.js');

// Media
const ytdl = require('ytdl-core');
var ytpl = require('ytpl');

// APIs & Keys
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(config.GOOGLE_API_KEY);

const MAX_PLAYLIST_SIZE = config.MAX_PLAYLIST_SIZE;

module.exports = {
    name: 'playlist',
    async execute(message, args) {
        const vChannel = message.member.voice.channel;
        const sQueue = message.client.queue.get(message.guild.id);

        const permissions = vChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) 
            return message.reply("I don't have permissions to connect to the voice channel");
        if(!permissions.has('SPEAK')) 
            return message.reply("I don't have permissions to speak in the channel");
        if(!args.length) 
            return message.reply(`Usage: ${config.prefix}play <youtube.url/name>`).catch(console.error);

        const search = args.join(" ");
        const pattern = /^.*(list=)([^#\&\?]*).*/gi;
        const url = args[0];
        const urlValid = pattern.test(args[0]);

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: vChannel,
            connection: null,
            songs: [],
            loop: false,
            volume: 50,
            playing: true
        };

        let playlist = null;
        let videos = [];
        
        if (urlValid) {
            try {
                
                playlist = await youtube.getPlaylist(url, { part: "snippet" });
                videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
            } catch (error) {
                console.error(error);
                return message.reply("I could not find the playlist!").catch(console.error);
            } 
        } else {
            try {
                const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
                playlist = results[0];
                videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
            } catch (error) {
                console.error(error);
                return message.reply(error.message).catch(console.error);
            }
        }

        const newSongs = videos
            .filter((video) => video.title != "Private video" && video.title != "Deleted video")
            .map((video) => {
                return (song = {
                    title: video.title,
                    url: video.url,
                    duration: video.durationSeconds
                });
            });

        sQueue ? sQueue.songs.push(...newSongs) : queueConstruct.songs.push(...newSongs);

        let playlistEmbed = new Discord.MessageEmbed()
            .setTitle(`${playlist.title}`)
            .setURL(playlist.url)
            .setColor("#F8AA2A")
            .setTimestamp();
            
        message.channel.send(`\`${message.author.username}\` has started a playlist`, playlistEmbed);
        
        if(!sQueue) {
            message.client.queue.set(message.guild.id, queueConstruct);

            const play = async song => {
                const queue = message.client.queue.get(message.guild.id);
                if(!song) {
                    setTimeout(function () {
                        if(queue.connection.dispatcher && message.guild.me.voice.channel) return;
                        queue.voiceChannel.leave();
                    }, 30 * 1000);
    
                    return message.client.queue.delete(message.guild.id)
                };

                const connection = await vChannel.join();
                const dispatcher = connection
                    .play(ytdl(song.url, {
                        filter: 'audioonly',
                        quality: 'highestaudio',
                        opusEncoded: true,
                        type: 'opus',
                        highWaterMark: 1 << 25
                    }))
                    .on('finish', () => {
                        if(queue.loop) {
                            let lastSong = queue.songs.shift();
                            queue.songs.push(lastSong);
                            play(queue.songs[0]);
                        } else {
                            queue.songs.shift();
                            play(queue.songs[0]);
                        }
                    })
                    .on('error', error => {
                        console.error(error);
                        queue.songs.shift();
                    });

                connection.on('disconnect', () => message.client.queue.delete(message.guild.id));
    
                dispatcher.setVolumeLogarithmic(queue.volume / 100);
                message.channel.send(`\`${song.title}\` is now playing in the ${vChannel} channel!`);
            };

            try{
                queueConstruct.connection = await vChannel.join();
                await queueConstruct.connection.voice.setSelfDeaf(true);
                play(queueConstruct.songs[0], message);
            } catch(error) {
                console.error(`I was unable to join the voice channel: ${error}`);
                message.client.queue.delete(message.guild.id);
                await voiceChannel.leave();
                return message.reply(`I could not join the voice channel: ${error}`);
            };
        };
    }
};