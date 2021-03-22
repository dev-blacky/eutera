const config = require('../core/config.json');
const {Util} = require('discord.js');

const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(config.GOOGLE_API_KEY);

module.exports = {
	name: 'tube',
	async execute(message, args) {
	    const vChannel = message.member.voice.channel;
        if(!vChannel) 
            return message.reply(`you need to be in a voice channel to play music`).catch(console.error);

        const sQueue = message.client.queue.get(message.guild.id);
        if (sQueue && vChannel !== message.guild.me.voice.channel) 
            return message.reply(`you must be in the same channel as ${message.client.user}`).catch(console.error);

        const permissions = vChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) 
            return message.reply("I don't have permissions to connect to the voice channel");
        if(!permissions.has('SPEAK')) 
            return message.reply("I don't have permissions to speak in the channel");
        if(!args.length) 
            return message.reply(`Usage: ${config.prefix}play <soundcloud.url> or <youtube.url/name>`).catch(console.error);

        const search = args.join(" ");
        const url = args[0];

        const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
            
        const urlValid = videoPattern.test(args[0]);

        const COOKIE = 'SID=5wexVlzYZ1v1GIwjR4f2v39zZ9SRrB-AtzuZQzUKKOabB5EO0-rzeW5cpldbVM_eoax8HQ.; APISID=WUYodWPnOnRhTFjz/AyjpbeHyvq-7Ruau4; SAPISID=J95PtBtgQI5YUtLh/AO2v_B3eKuhc6zTw-; SIDCC=AJi4QfEUM-JsrpRW-kpKe6m5V-hafFRCk5AaTNvPfvIubnQH5RMGs6yYaCto4f0sY5cgEKb78z8';

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: vChannel,
            connection: null,
            songs: [],
            loop: false,
            playing: true
        };

        if(urlValid) {
            try {
                songInfo = await ytdl.getInfo(url, {
                    requestOptions: {
                        headers: {
                            cookie: COOKIE
                        },
                    },
                });
                song = {
                    title: Util.escapeMarkdown(songInfo.videoDetails.title),
                    url: songInfo.videoDetails.video_url,
                    duration: songInfo.videoDetails.video_url
                }
            } catch(error) {
                console.error(error);
                return message.reply(`${error.message ? error.message : error}`);
            }
        } else {
            try {
                const results = await youtube.searchVideos(search, 1);
                songInfo = await ytdl.getInfo(results[0].url);
                song = {
                    title: Util.escapeMarkdown(songInfo.videoDetails.title),
                    duration: songInfo.videoDetails.lengthSeconds,
                    url: songInfo.videoDetails.video_url
                };
            } catch(error) {
                console.error(error);
                return message.reply(`${error.message ? error.message : error}`);
            };
        };

        if(sQueue) {
            sQueue.songs.push(song);
            return sQueue.textChannel
                .send(`**${song.title}** has been added to the queue by \`${message.author.username}\``)
                .catch(console.error);
        };

        queueConstruct.songs.push(song);
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

            dispatcher.setVolumeLogarithmic(config.volume / 100);
            message.channel.send(`**${song.title}** is now playing in the ${vChannel} channel!`);
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
	}
};