const config = require('../core/config.json');
const Discord = require('discord.js');

const scdl = require('soundcloud-downloader').default;
const soundcloud = config.SOUNDCLOUD_CLIENT_ID;

module.exports = {
    name: 'soundcloud',
    async execute(message, args) {
        // some permissions in case of stuff happening.
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
            return message.reply(`Usage: ${config.prefix}play <youtube.url/name>`).catch(console.error);

        const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
        const url = args[0];



        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: vChannel,
            connection: null,
            songs: [],
            loop: false,
            playing: true
        };

        const track = await scdl.getInfo(url, soundcloud);
        song = {
            title: track.title,
            url: track.permalink_url,
            duration: Math.ceil(track.duration / 1000)
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

            let stream = null;

            if(song.url.includes('soundcloud.com')) {
                try {
                    stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, soundcloud);
                } catch(error) {
                    stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, soundcloud);
                    streamType = "unknown";
                };
            };

            const connection = await vChannel.join();
            const dispatcher = connection
                .play(stream)
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