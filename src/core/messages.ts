import i18n = require('i18n')
import { Client, Guild, TextChannel } from 'discord.js'
import { Configuration } from 'api';

/**
 * Sends a welcome message to a guild in the first channel the bot has write access to,
 * for use when the bot joins or is first run on a guild
 * @param client The discord client instance
 * @param guild The guild to welcome
 */
export function sendWelcomeMessage(client: Client, guild: Guild, config: Configuration) {
    if (config.welcomeMessage === true) {
        guild.channels.forEach(channel => {
            if (channel.type === "text") {
                const textChannel = channel as TextChannel;
                const me = guild.members.get(client.user.id)
                if (textChannel.memberPermissions(me).has("SEND_MESSAGES")) {
                    const message = i18n.__('Hello everyone!').concat(' ').concat(me.displayName).concat(' ').concat(i18n.__(" here.")).concat('\r\n')
                        .concat(i18n.__("I'm a configurable modular bot, with a potential variety of functions!")).concat('\r\n')
                        .concat(i18n.__("Feel free to ask for")).concat(' `').concat(config.defaultPrefix).concat(i18n.__('help')).concat('` ').concat(i18n.__("if you're interested in learning more!")).concat('\r\n')
                        .concat(i18n.__("Cheers!")).concat(` :${getHeart()}:`);
                    textChannel.send(message)
                }
            }
        });
    }
}

/**
 * Gets a heart reaction from a list of them!
 */
export function getHeart() {
    const hearts = [
        "heart",
        "yellow_heart",
        "green_heart",
        "blue_heart",
        "purple_heart",
        "heart_exclamation",
        "two_hearts",
        "revolving_hearts",
        "heartbeat",
        "heartpulse",
        "sparkling_heart",
        "cupid",
        "gift_heart",
        "heart_decoration",
        "hearts",
        "black_heart"
    ]
    const i: number = Math.floor(Math.random() * hearts.length)
    return hearts[i]
}