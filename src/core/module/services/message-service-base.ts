import i18n = require('i18n');
import { injectable, inject } from 'inversify';
import { SERVICE_IDENTIFIERS, ClientWrapper, AppConfiguration, forEachAsync, LoopStateArgs } from 'api';
import { Guild, Message, Channel, TextChannel, GuildMember } from 'discord.js';
import { GuildConfiguration } from 'db';
import { MessageService } from 'core';

@injectable()
export default class MessageServiceBase implements MessageService {
    constructor(
        @inject(SERVICE_IDENTIFIERS.CONFIGURATION) public configuration: AppConfiguration,
        @inject(SERVICE_IDENTIFIERS.CLIENT) public client: ClientWrapper) {}

    async sendGuildWelcomeMessage(guild: Guild): Promise<any> {
        const guildConfiguration: GuildConfiguration = await GuildConfiguration.load(guild);
        if(this.configuration.showWelcomeMessage && !guildConfiguration.welcomeMsgSent) {
            await forEachAsync(
                guild.channels.array(),
                async (channel: Channel, _: number, __: Channel[], loopStateArgs: LoopStateArgs): Promise<any> => {
                    if(channel.type !== 'text') {
                        return Promise.resolve();
                    }
                    const textChannel: TextChannel = channel as TextChannel;
                    const me: GuildMember = guild.members.get(this.client.userId);
                    const prefix: string = guildConfiguration.commandPrefix;
                    if(textChannel.memberPermissions(me).has('SEND_MESSAGES')) {
                        const message: string = i18n.__('Hello everyone! ').concat(me.displayName).concat(i18n.__(' here.')).concat('\r\n')
                            .concat(i18n.__('I\'m a configurable modular bot, with a potential variety of functions!')).concat('\r\n')
                            .concat(i18n.__('Feel free to ask for ')).concat('`').concat(prefix.concat('help')).concat('`')
                            .concat(i18n.__(' if you\'re interested in learning more!')).concat('\r\n')
                            .concat(i18n.__('Cheers! ')).concat(this.getRandomHeart());
                        await textChannel.send(message);
                        guildConfiguration.welcomeMsgSent = true;
                        loopStateArgs.break();
                        return Promise.resolve();
                    }
                });
            return await guildConfiguration.save();
        }
    }

    async sendHelpMessage(message: Message): Promise<any> {
        let helpMessage: string;
        let prefix: string = this.configuration.defaultPrefix;

        if(!message.guild) {
            helpMessage = i18n.__('Hi! I\'m ').concat(this.client.username);
        }
        else {
            helpMessage = i18n.__('hi! I\'m ').concat(message.guild.me.displayName);
        }

        helpMessage = helpMessage.concat(i18n.__(', your modular robot friend!')).concat('\r\n')
            .concat(i18n.__('To list all the commands that I can understand, just send '))
            .concat(`\`${prefix}help --all\``).concat(i18n.__(' to any channel I can read, or via direct message.')).concat('\r\n')
            .concat(i18n.__('You can also check out my documentation on ')).concat('<https://www.github.com/satyrnidae/another-pluggable-discord-bot>\r\n')
            .concat(i18n.__('Thanks! ')).concat(this.getRandomHeart())
        return await message.reply(helpMessage)
    }

    //TODO: Per-guild hearts?
    getRandomHeart(): string {
        const hearts = this.configuration.hearts;
        const index: number = Math.floor(Math.random() * hearts.length);
        return `:${hearts[index]}:`;
    }
}