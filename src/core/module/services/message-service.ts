import * as i18n from 'i18n';
import { injectable, inject } from 'inversify';
import { Guild, Message, Channel, TextChannel, GuildMember, PartialTextBasedChannelFields, GuildChannel, RichEmbed } from 'discord.js';
import { ServiceIdentifiers, ConfigurationService, ClientService, CommandService, ModuleService } from 'api/services';
import { GuildConfiguration } from 'db/entity';
import { GuildConfigurationFactory } from 'db/factory';
import { forEachAsync, LoopStateArgs } from 'api/utils';
import { Command, Module } from 'api/module';

const MAX_FIELDS = 24;

@injectable()
export default class MessageService {
    constructor(
        @inject(ServiceIdentifiers.Configuration) public configuration: ConfigurationService,
        @inject(ServiceIdentifiers.Client) public clientService: ClientService,
        @inject(ServiceIdentifiers.Command) public commandService: CommandService,
        @inject(ServiceIdentifiers.Module) public moduleService: ModuleService) {}

    async sendGuildWelcomeMessage(guild: Guild): Promise<void> {
        const showWelcomeMessage = await this.configuration.shouldShowWelcomeMessage();
        const guildConfiguration: GuildConfiguration = await new GuildConfigurationFactory().load(guild, true);

        if(!showWelcomeMessage || guildConfiguration.welcomeMsgSent) {
            return;
        }
        const me: GuildMember = guild.members.get(this.clientService.userId);
        const announceChannel: TextChannel = guild.channels
            .filter(channel => channel instanceof TextChannel && channel.memberPermissions(me).has('SEND_MESSAGES')).first() as TextChannel;
        if (announceChannel && await this.sendWelcomeMessage(announceChannel)) {
            guildConfiguration.welcomeMsgSent = true;
            await guildConfiguration.save();
        }
    }

    async sendHelpMessage(message: Message): Promise<any> {
        const prefix: string = await this.commandService.getCommandPrefix(message);

        const helpMessage: string = i18n.__('Hi! I\'m %s, your modular robot friend!', this.clientService.getDisplayName(message.guild)).concat('\r\n')
            .concat(i18n.__('To list all the commands that I can understand, just send `%s` somewhere I can read it!', `${prefix}help --all`)).concat('\r\n')
            .concat(i18n.__('You can also check out my documentation on %s', '<https://www.github.com/satyrnidae/another-pluggable-discord-bot>')).concat('\r\n')
            .concat(i18n.__('Thanks! %s', await this.configuration.getRandomHeart()));
        return message.channel.send(helpMessage);
    }

    async sendAllHelpMessage(message: Message, page = 1): Promise<void> {
        const prefix: string = await this.commandService.getCommandPrefix(message);
        const modules: Module[] = this.moduleService.modules;
        const pages: number = Math.ceil(modules.length / MAX_FIELDS);
        const paginatedModules: Module[] = [];
        const displayedPage: number = Math.min(pages, page);

        if (pages === 0) {
            await message.channel.send(i18n.__('There are no commands for me to list!'));
            return;
        }

        const start: number = (displayedPage - 1) * MAX_FIELDS;
        const modulesWithCommands: Module[] = modules.filter(module => this.commandService.getAll(module.moduleInfo.id).length);
        paginatedModules.push(...modulesWithCommands.slice(start, start + MAX_FIELDS));

        const embed: RichEmbed = new RichEmbed()
            .setTitle(i18n.__('__All Commands__'))
            .setDescription(i18n.__('Here is a list of all commands grouped by module.'))
            .setFooter(i18n.__('Page %s of %s', displayedPage.toString(), pages.toString()));

        await forEachAsync(paginatedModules, async (module: Module) => {
            const commandsForModule: Command[] = this.commandService.getAll(module.moduleInfo.id);
            if(commandsForModule.length > 0) {
                embed.addField(i18n.__('**%s**', module.moduleInfo.name), i18n.__('*id: %s*', module.moduleInfo.id)
                    .concat(await this.getCommandList(message, commandsForModule)), true);
            }
        });

        embed.addField(i18n.__('**More Help**'), i18n.__('You may execute the following to see more about a specific command in this list:').concat('\r\n')
                .concat(i18n.__('> %s%s', prefix, 'help [-c|--command] *command*')).concat('\r\n')
                .concat(i18n.__('And, to see more about a specific module:')).concat('\r\n')
                .concat(i18n.__('> %s%s', prefix, 'help [-m|--moduleId] *moduleId*')).concat('\r\n')
                .concat(i18n.__('Additionally, there may be more pages available; check the footer!')), false);

        await message.channel.send(i18n.__('Here\'s a list of the commands that I can handle:'), embed);
        return;
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
                .concat(await this.getCommandList(message, otherMatchingCommands, true)));
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
                .concat(await this.getCommandList(message, commands, true)).concat('\r\n')
                .concat(i18n.__('You can find out more by specifying a module ID when you call %shelp:', prefix)).concat('\r\n')
                .concat(i18n.__('> %s%s', prefix, 'help [-c|--command] *command* [-m|--module|--moduleId] *module*')).concat('/r/n')
                .concat(i18n.__('When you execute the command, be sure to specify the module ID as well:')).concat('\r\n')
                .concat(i18n.__('> %s[moduleId]/[command] [parameters]'));
            return message.channel.send(helpMessage);
        }

        return this.sendCommandUsageMessage(message, commands[0]);
    }

    async sendPermissionDeniedMessage(message: Message): Promise<UnionArray<Message>> {
        return message.reply(i18n.__('unfortunately, you do not have permission to perform that command!'));
    }

    private async sendWelcomeMessage(channel: TextChannel & GuildChannel) {
        const guildConfiguration: GuildConfiguration = await new GuildConfigurationFactory().load(channel.guild);
        const prefix: string = guildConfiguration.commandPrefix;
        const me: GuildMember = channel.guild.members.get(this.clientService.userId);

        const message: string = i18n.__('Hello everyone! %s here.', me.displayName).concat('\r\n')
            .concat(i18n.__('I\'m a configurable modular bot, with a potential variety of functions!')).concat('\r\n')
            .concat(i18n.__('Feel free to ask for `%shelp` if you\'re interested in learning more!', prefix).concat('\r\n')
            .concat(i18n.__('Cheers! %s', await this.configuration.getRandomHeart())));
        return channel.send(message);
    }

    private async getCommandList(message: Message, commands: Command[], showModule = false): Promise<string> {
        let allCommands = '';
        await forEachAsync(commands, async (currentCommand: Command): Promise<void> => {
            allCommands = allCommands.concat('\r\n').concat(await this.getCommandListEntry(message, currentCommand, showModule));
        });
        return allCommands;
    }

    private async getCommandListEntry(message: Message, command: Command, showModule = false): Promise<string> {
        const prefix: string = await this.commandService.getCommandPrefix(message);
        let commandEntry: string = i18n.__(this.COMMAND_MODULE_ID_LIST, prefix, command.command);
        if(showModule) {
            const module = this.moduleService.getModuleById(command.moduleId);
            commandEntry = commandEntry.concat(i18n.__(' *from module **%s***', module.moduleInfo.name));
        }
        return commandEntry;
    }

    private async sendCommandUsageMessage(message: Message, command: Command): Promise<any> {
        const prefix: string = await this.commandService.getCommandPrefix(message);
        const module: Module = this.moduleService.getModuleById(command.moduleId);
        let helpMessage = '';
        await forEachAsync(command.syntax, async (syntax: string): Promise<void> => {
            helpMessage = helpMessage.concat('\r\n')
                .concat(i18n.__('> • %s%s', prefix, syntax));
        });

        const commandEmbed: RichEmbed = new RichEmbed()
            .setTitle(i18n.__('__%s__', command.friendlyName))
            .setDescription(i18n.__('*from module %s (id: %s)*', module.moduleInfo.name, module.moduleInfo.id))
            .addField(i18n.__('**Description**'), command.description || i18n.__('*no description available*'))
            .addField(i18n.__('**Usage**'), helpMessage || i18n.__('*no usage information available*'));

        return message.channel.send(i18n.__('Help for command `%s%s`:', prefix, command.command), commandEmbed);
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
    private readonly COMMAND_MODULE_ID_LIST: string = '> • %s%s';
}
