import i18n = require('i18n');
import { injectable, inject } from 'inversify';
import { SERVICE_IDENTIFIERS, ClientWrapper, AppConfiguration, forEachAsync, LoopStateArgs, Command, CommandRegistry, CommandService } from 'api';
import { Guild, Message, Channel, TextChannel, GuildMember } from 'discord.js';
import { GuildConfiguration } from 'db';
import { MessageService } from 'core';

@injectable()
export default class MessageServiceBase implements MessageService {
    constructor(
        @inject(SERVICE_IDENTIFIERS.CONFIGURATION) public configuration: AppConfiguration,
        @inject(SERVICE_IDENTIFIERS.CLIENT) public client: ClientWrapper,
        @inject(SERVICE_IDENTIFIERS.COMMAND_REGISTRY) public commandRegistry: CommandRegistry,
        @inject(SERVICE_IDENTIFIERS.COMMAND_SERVICE) public commandService: CommandService) {}

    async sendGuildWelcomeMessage(guild: Guild): Promise<any> {
        const guildConfiguration: GuildConfiguration = await GuildConfiguration.load(guild);
        if(!this.configuration.showWelcomeMessage || guildConfiguration.welcomeMsgSent) {
            return;
        }

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
                    const message: string = i18n.__('Hello everyone! %s here.', me.displayName).concat('\r\n')
                        .concat(i18n.__('I\'m a configurable modular bot, with a potential variety of functions!')).concat('\r\n')
                        .concat(i18n.__('Feel free to ask for `%shelp` if you\'re interested in learning more!', prefix).concat('\r\n')
                        .concat(i18n.__('Cheers! %s'), this.getRandomHeart()));
                    await textChannel.send(message);
                    guildConfiguration.welcomeMsgSent = true;
                    loopStateArgs.break();
                    return Promise.resolve();
                }
            });
        await guildConfiguration.save();
    }

    async sendHelpMessage(message: Message): Promise<any> {
        const prefix: string = await this.commandService.getCommandPrefix(message);

        const helpMessage: string = i18n.__('Hi! I\'m %s, your modular robot friend!', message.guild.me.displayName || this.client.username).concat('\r\n')
            .concat(i18n.__('To list all the commands that I can understand, just send `%s` somewhere I can read it!', `${prefix}help --all`)).concat('\r\n')
            .concat(i18n.__('You can also check out my documentation on %s', '<https://www.github.com/satyrnidae/another-pluggable-discord-bot>')).concat('\r\n')
            .concat(i18n.__('Thanks! %s', this.getRandomHeart()));
        return message.reply(helpMessage);
    }

    async sendAllHelpMessage(message: Message): Promise<any> {
        const prefix: string = await this.commandService.getCommandPrefix(message);
        const commands: Command[] = this.commandRegistry.registry;
        let allCommands: string = '';
        await forEachAsync(commands, async (currentCommand: Command): Promise<void> => {
            allCommands = allCommands.concat(`\t•\t${currentCommand.name}\r\n`);
        });

        const helpMessage: string = i18n.__('Here\'s a list of all the commands that I can handle:').concat('\r\n')
            .concat(allCommands)
            .concat(i18n.__('You can find out more by specifying a single command:')).concat('\r\n')
            .concat(i18n.__('\t\t`%s`', `${prefix}help [-c|command] *command*`));
        return message.reply(helpMessage);
    }

    //TODO: Per-guild hearts?
    getRandomHeart(): string {
        const hearts = this.configuration.hearts;
        const index: number = Math.floor(Math.random() * hearts.length);
        return `:${hearts[index]}:`;
    }
}
