import i18n = require('i18n');
import { injectable, inject } from 'inversify';
import { forEachAsync, LoopStateArgs, Command, CommandService, ConfigurationService, ServiceIdentifiers, ClientService, Module, ModuleService } from 'api';
import { Guild, Message, Channel, TextChannel, GuildMember } from 'discord.js';
import { GuildConfiguration, GuildConfigurationFactory } from 'db';

@injectable()
export default class MessageService {
    constructor(
        @inject(ServiceIdentifiers.Configuration) public configuration: ConfigurationService,
        @inject(ServiceIdentifiers.Client) public clientService: ClientService,
        @inject(ServiceIdentifiers.Command) public commandService: CommandService,
        @inject(ServiceIdentifiers.Module) public moduleService: ModuleService) {}

    async sendGuildWelcomeMessage(guild: Guild): Promise<any> {
        const showWelcomeMessage = await this.configuration.shouldShowWelcomeMessage();
        const guildConfiguration: GuildConfiguration = await new GuildConfigurationFactory().load(guild);

        if(!showWelcomeMessage || guildConfiguration.welcomeMsgSent) {
            return;
        }

        await forEachAsync(
            guild.channels.array(),
            async (channel: Channel, _: number, __: Channel[], loopStateArgs: LoopStateArgs): Promise<any> => {
                if(channel.type !== 'text') {
                    return Promise.resolve();
                }
                const textChannel: TextChannel = channel as TextChannel;
                const me: GuildMember = guild.members.get(this.clientService.userId);
                const prefix: string = guildConfiguration.commandPrefix;
                if(textChannel.memberPermissions(me).has('SEND_MESSAGES')) {
                    const message: string = i18n.__('Hello everyone! %s here.', me.displayName).concat('\r\n')
                        .concat(i18n.__('I\'m a configurable modular bot, with a potential variety of functions!')).concat('\r\n')
                        .concat(i18n.__('Feel free to ask for `%shelp` if you\'re interested in learning more!', prefix).concat('\r\n')
                        .concat(i18n.__('Cheers! %s', await this.configuration.getRandomHeart())));
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

        const helpMessage: string = i18n.__('Hi! I\'m %s, your modular robot friend!', this.clientService.getDisplayName(message.guild)).concat('\r\n')
            .concat(i18n.__('To list all the commands that I can understand, just send `%s` somewhere I can read it!', `${prefix}help --all`)).concat('\r\n')
            .concat(i18n.__('You can also check out my documentation on %s', '<https://www.github.com/satyrnidae/another-pluggable-discord-bot>')).concat('\r\n')
            .concat(i18n.__('Thanks! %s', await this.configuration.getRandomHeart()));
        return message.channel.send(helpMessage);
    }

    async sendAllHelpMessage(message: Message): Promise<any> {
        const prefix: string = await this.commandService.getCommandPrefix(message);
        const commands: Command[] = this.commandService.commands;

        const helpMessage: string = i18n.__('Here\'s a list of all the commands that I can handle:')
            .concat(await this.getCommandList(message, commands)).concat('\r\n')
            .concat(i18n.__('You can find out more by specifying a single command:')).concat('\r\n')
            .concat(i18n.__('> %s%s', prefix, 'help [-c|--command] *command*'));
        return message.channel.send(helpMessage);
    }

    async sendModuleCommandListMessage(message: Message, moduleId: string): Promise<any> {
        if(moduleId === 'all') {
            return this.sendAllModuleListHelpMessage(message);
        }

        const modules: Module[] = this.moduleService.getModulesByIdOrName(moduleId);
        if(!(modules && modules.length)) {
            return this.sendModuleNotFoundHelpMessage(message, moduleId);
        }
        if(modules.length > 1) {
            return this.sendMultipleModulesHelpMessage(message, moduleId, modules);
        }

        const module: Module = modules[0];
        const commands: Command[] = this.commandService.getAll(module.moduleInfo.id);

        if (!(commands && commands.length)) {
            return this.sendModuleHasNoCommandsHelpMessage(message, module);
        }
        return message.channel.send(i18n.__('The module "%s" (id: %s) contains the following commands:', module.moduleInfo.name, module.moduleInfo.id)
            .concat(await this.getCommandList(message, commands)));
    }

    async sendModuleCommandHelpMessage(message: Message, moduleId: string, command: string): Promise<any> {
        const prefix: string = await this.commandService.getCommandPrefix(message);

        if(moduleId === 'all') {
            return this.sendCommandHelpMessage(message, command);
        }
        const modules: Module[] = this.moduleService.getModulesByIdOrName(moduleId);
        if(!(modules && modules.length)) {
            return this.sendModuleNotFoundHelpMessage(message, moduleId);
        }
        if(modules.length > 1) {
            return this.sendMultipleModulesHelpMessage(message, moduleId, modules);
        }

        const module: Module = modules[0];
        const commandInstance: Command = this.commandService.get(command, module.moduleInfo.id)[0];

        if(commandInstance) {
            return this.sendCommandUsageMessage(message, commandInstance);
        }

        const otherMatchingCommands: Command[] = this.commandService.get(command);
        if(otherMatchingCommands && otherMatchingCommands.length) {
            return message.channel.send(i18n.__('I could not find the command "%s%s" in the module %s (id: %s), but I did find commands in other modules that matched:',
                prefix, command, module.moduleInfo.name, module.moduleInfo.id)
                .concat(await this.getCommandList(message, otherMatchingCommands)));
        }
        //TODO: stuff here
        return message.channel.send(i18n.__('I could not find the command "%s%s" in the module %s (id: %s).',
            prefix, command, module.moduleInfo.name, module.moduleInfo.id));
    }

    async sendCommandHelpMessage(message: Message, command: string): Promise<any> {
        const prefix: string = await this.commandService.getCommandPrefix(message);
        const commands: Command[] = this.commandService.get(command);

        if(!(commands && commands.length)) {
            return message.reply(i18n.__('I don\'t know the command "%s"!', command));
        }
        if(commands.length > 1) {
            const helpMessage: string = i18n.__('Multiple commands matched the given ID %s:', command)
                .concat(await this.getCommandList(message, commands)).concat('\r\n')
                .concat(i18n.__('You can find out more by specifying a module ID when you call %shelp:', prefix)).concat('\r\n')
                .concat(i18n.__('> %s%s', prefix, 'help [-c|--command] *command* [-m|--module|--moduleId] *module*')).concat('/r/n')
                .concat(i18n.__('When you execute the command, be sure to specify the module ID as well:')).concat('\r\n')
                .concat(i18n.__('> %s[moduleId]/[command] [parameters]'));
            return message.channel.send(helpMessage);
        }

        return this.sendCommandUsageMessage(message, commands[0]);
    }

    private async getCommandList(message: Message, commands: Command[]): Promise<string> {
        let allCommands: string = '';
        await forEachAsync(commands, async (currentCommand: Command): Promise<void> => {
            allCommands = allCommands.concat('\r\n').concat(await this.getCommandListEntry(message, currentCommand));
        });
        return allCommands;
    }

    private async getCommandListEntry(message: Message, command: Command): Promise<string> {
        const prefix: string = await this.commandService.getCommandPrefix(message);
        const module: Module = this.moduleService.getModuleById(command.moduleId);
        return i18n.__(this.COMMAND_MODULE_ID_LIST,
            command.name, prefix, command.command, module.moduleInfo.name, module.moduleInfo.id);
    }

    private async sendCommandUsageMessage(message: Message, command: Command): Promise<any> {
        const prefix: string = await this.commandService.getCommandPrefix(message);
        const module: Module = this.moduleService.getModuleById(command.moduleId);
        let helpMessage: string = i18n.__('__**"%s" Command**__', command.name).concat('\r\n')
            .concat(i18n.__('*in module* %s (id: %s)', module.moduleInfo.name, module.moduleInfo.id)).concat('\r\n')
            .concat('*Description*').concat('\r\n')
            .concat(i18n.__('> %s', command.description)).concat('\r\n')
            .concat(i18n.__('*Usage*'));
        await forEachAsync(command.syntax, async (syntax: string): Promise<void> => {
            helpMessage = helpMessage.concat('\r\n')
                .concat(i18n.__('> • %s%s', prefix, syntax));
        });
        return message.channel.send(helpMessage);
    }

    private async sendModuleHasNoCommandsHelpMessage(message: Message, module: Module): Promise<any> {
        return message.channel.send(i18n.__('The module "%s" (id: %s) does not contain any commands.', module.moduleInfo.name, module.moduleInfo.id));
    }

    private async sendAllModuleListHelpMessage(message: Message): Promise<any> {
        let allModulesHelpMessage: string = i18n.__('The following modules are currently loaded:');
        this.moduleService.modules.forEach((namedModule: Module) => {
            allModulesHelpMessage = allModulesHelpMessage.concat('\r\n')
                .concat(i18n.__(this.MODULE_ID_LIST_STRING, namedModule.moduleInfo.name, namedModule.moduleInfo.id));
        });
        return message.channel.send(allModulesHelpMessage);
    }

    private async sendModuleNotFoundHelpMessage(message: Message, moduleNameOrId: string): Promise<any> {
        return message.channel.send(i18n.__('There is no module currently loaded with the name or ID "%s".', moduleNameOrId));
    }

    private async sendMultipleModulesHelpMessage(message: Message, moduleName: string, modules: Module[]): Promise<any> {
        let multipleModulesHelpMessage: string = i18n.__('There are currently multiple modules matching the term "%s":', moduleName);
            modules.forEach((namedModule: Module) => {
                multipleModulesHelpMessage = multipleModulesHelpMessage.concat('\r\n')
                    .concat(i18n.__(this.MODULE_ID_LIST_STRING, namedModule.moduleInfo.name, namedModule.moduleInfo.id));
            });
            return message.channel.send(multipleModulesHelpMessage);
    }

    private readonly MODULE_ID_LIST_STRING: string = '> • %s (id: %s)';
    private readonly COMMAND_MODULE_ID_LIST: string = '> • %s (%s%s) *in module "%s" (id: %s)*';
}
