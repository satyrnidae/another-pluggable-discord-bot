import i18n = require('i18n')
import { Client, Guild, TextChannel, Message, Channel, GuildMember } from 'discord.js'
import { Configuration, forEachAsync } from 'api';

export async function sendWelcomeMessage(client: Client, guild: Guild, config: Configuration): Promise<any> {
    if (config.welcomeMessage === true) {
        return await forEachAsync(guild.channels.array(), async(channel: Channel): Promise<any> => {
            if (channel.type === 'text') {
                const textChannel: TextChannel = channel as TextChannel;
                const me: GuildMember = guild.members.get(client.user.id);
                //TODO: Guild-specific prefixes
                const prefix: string = config.defaultPrefix;
                if (textChannel.memberPermissions(me).has('SEND_MESSAGES')) {
                    const message: string = i18n.__('Hello everyone! ').concat(me.displayName).concat(i18n.__(' here.')).concat('\r\n')
                        .concat(i18n.__('I\'m a configurable modular bot, with a potential variety of functions!')).concat('\r\n')
                        .concat(i18n.__('Feel free to ask for ')).concat('`').concat(prefix.concat('help')).concat('`')
                        .concat(i18n.__(' if you\'re interested in learning more!')).concat('\r\n')
                        .concat(i18n.__('Cheers! ')).concat(`:${getHeart()}:`);
                    return await textChannel.sendMessage(message);
                }
            }
        });
    }
}

export async function sendGeneralHelpMessage(client: Client, message: Message, config: Configuration): Promise<any> {
    let helpMessage: string;
    //TODO: Per-guild prefixes
    const prefix: string = config.defaultPrefix;

    if(!message.guild) {
      helpMessage = i18n.__('Hi! I\'m ').concat(client.user.username);
    }
    else {
      helpMessage = i18n.__('hi! I\'m ').concat(message.guild.me.displayName);
    }

    helpMessage = helpMessage.concat(i18n.__(', your modular robot friend!')).concat('\r\n')
      .concat(i18n.__('To list all the commands that I can understand, just send ')).concat('`')
      .concat(prefix).concat('help --all`').concat(i18n.__(' to any channel I can read, or via direct message.')).concat('\r\n')
      .concat(i18n.__('You can also check out my documentation on ')).concat('<https://www.github.com/satyrnidae/another-pluggable-discord-bot>\r\n')
      .concat(i18n.__('Thanks! ')).concat(`:${getHeart()}:`)
    return await message.reply(helpMessage)
  }

export function getHeart() {
    const hearts = [
        'heart',
        'yellow_heart',
        'green_heart',
        'blue_heart',
        'purple_heart',
        'heart_exclamation',
        'two_hearts',
        'revolving_hearts',
        'heartbeat',
        'heartpulse',
        'sparkling_heart',
        'cupid',
        'gift_heart',
        'heart_decoration',
        'hearts',
        'black_heart'
    ]
    const index: number = Math.floor(Math.random() * hearts.length)
    return hearts[index]
}
