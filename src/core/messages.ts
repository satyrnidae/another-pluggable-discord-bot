import i18n = require('i18n')
import { Client, Guild, TextChannel, Message } from 'discord.js'
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
 * Sends a general help message to one lucky person, either on a guild or in a DM
 * @param client The discord client instance
 * @param message The message to reply to
 */
export function sendGeneralHelpMessage(client: Client, message: Message, config: Configuration) {
    var helpMessage: string;
    var prefix = config.defaultPrefix;

    if(!message.guild) {
      helpMessage = i18n.__("Hi! I'm").concat(' ').concat(client.user.username);
    }
    else {
      helpMessage = i18n.__("hi! I'm").concat(' ').concat(message.guild.me.displayName);
    }

    helpMessage = helpMessage.concat(i18n.__(", your modular robot friend!")).concat('\r\n')
      .concat(i18n.__("To list all the commands that I can understand, just send")).concat(' `').concat(prefix).concat('help --all` ').concat(i18n.__("to any channel I can read, or via direct message.")).concat('\r\n')
      .concat(i18n.__("You can also check out my documentation on")).concat(' <https://www.github.com/satyrnidae/another-pluggable-discord-bot>\r\n')
      .concat(i18n.__("Thanks!")).concat(` :${getHeart()}:`)
    return message.reply(helpMessage)
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