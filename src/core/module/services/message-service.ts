import * as i18n from 'i18n';
import { injectable, inject } from 'inversify';
import { Guild, Message, TextChannel, GuildMember, GuildChannel, RichEmbed } from 'discord.js';
import { ServiceIdentifiers, ConfigurationService, ClientService, CommandService, ModuleService } from '/src/api/services';
import { GuildConfiguration } from '/src/db/entity';
import { GuildConfigurationFactory } from '/src/db/factory';
import { unionToArray, forEachAsync, unionToInstance } from '/src/api/utils';
import { Module, Command } from '/src/api/module';

const MAX_FIELDS = 24;

@injectable()
export class MessageService {
    /**
     * @param configurationService The injected configuration service instance
     * @param clientService The injected client service instance
     * @param commandService The injected command service instance
     * @param moduleService The injected module service instance
     * @param guildConfigurationFactory The injected guild configuration factory instance
     */
    constructor(@inject(ServiceIdentifiers.Configuration) private readonly configurationService: ConfigurationService,
        @inject(ServiceIdentifiers.Client) private readonly clientService: ClientService,
        @inject(ServiceIdentifiers.Command) private readonly commandService: CommandService,
        @inject(ServiceIdentifiers.Module) private readonly moduleService: ModuleService,
        @inject(GuildConfigurationFactory) private readonly guildConfigurationFactory: GuildConfigurationFactory) { }

    async sendGuildWelcomeMessage(guild: Guild): Promise<void> {
        const showWelcomeMessage = await this.configurationService.shouldShowWelcomeMessage();
        const guildConfiguration: GuildConfiguration = await this.guildConfigurationFactory.load(guild, true);

        if (!showWelcomeMessage || guildConfiguration.welcomeMsgSent) {
            return;
        }
        const me: GuildMember = guild.members.get(this.clientService.user.id);
        const announceChannel: TextChannel = guild.channels
            .filter(channel => channel instanceof TextChannel && channel.memberPermissions(me).has('SEND_MESSAGES')).first() as TextChannel;
        if (announceChannel && await this.sendWelcomeMessage(announceChannel)) {
            guildConfiguration.welcomeMsgSent = true;
            await guildConfiguration.save();
        }
    }

    async sendHelpMessage(message: Message): Promise<void> {
        const prefix: string = await this.commandService.getCommandPrefix(message.guild);

        const helpMessage: string = i18n.__('Hi! I\'m %s, your modular robot friend!', this.clientService.getDisplayName(message.guild)).concat('\r\n')
            .concat(i18n.__('To list all the commands that I can understand, just send `%s` somewhere I can read it!', `${prefix}help --all`)).concat('\r\n')
            .concat(i18n.__('You can also check out my documentation on %s', '<https://www.github.com/satyrnidae/another-pluggable-discord-bot>')).concat('\r\n')
            .concat(i18n.__('Thanks! %s', await this.configurationService.getRandomHeart()));
        await message.channel.send(helpMessage);
    }

    async sendAllHelpMessage(message: Message, page = 1): Promise<void> {
        const prefix: string = await this.commandService.getCommandPrefix(message.guild);
        const modules: Module[] = unionToArray(this.moduleService.getAllModules());
        const pages: number = Math.ceil(modules.length / MAX_FIELDS);
        const paginatedModules: Module[] = [];
        const displayedPage: number = Math.max(1, Math.min(pages, page));

        if (pages === 0) { // Wow how the heck did this happen
            await message.channel.send(i18n.__('There are no commands for me to list!'));
            return;
        }

        const start: number = (displayedPage - 1) * MAX_FIELDS;
        const modulesWithCommands: Module[] = modules.filter(module => this.commandService.getAll(module.moduleInfo.id));
        paginatedModules.push(...modulesWithCommands.slice(start, start + MAX_FIELDS));

        const embed: RichEmbed = new RichEmbed()
            .setTitle(i18n.__('__All Commands__'))
            .setDescription(i18n.__('Here is a list of all commands grouped by module.'))
            .setFooter(i18n.__('Page %s of %s', displayedPage.toString(), pages.toString()));

        await forEachAsync(paginatedModules, async (module: Module) => {
            const commandsForModule: Command[] = unionToArray(this.commandService.getAll(module.moduleInfo.id));
            if (commandsForModule.length > 0) {
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
    }

    async sendModuleCommandListMessage(message: Message, moduleId: string): Promise<void> {
        if (moduleId === 'all') {
            await this.sendAllModuleListHelpMessage(message);
            return;
        }

        const modules: UnionArray<Module> = this.moduleService.getModulesByIdOrName(moduleId);
        if (!modules) {
            await this.sendModuleNotFoundHelpMessage(message, moduleId);
            return;
        }
        if (modules instanceof Array) {
            await this.sendMultipleModulesHelpMessage(message, moduleId, modules);
            return;
        }

        const commands: UnionArray<Command> = this.commandService.getAll(modules.moduleInfo.id);

        if (!commands) {
            await this.sendModuleHasNoCommandsHelpMessage(message, modules);
        }
        await message.channel.send(i18n.__('The module "%s" (id: %s) contains the following commands:', modules.moduleInfo.name, modules.moduleInfo.id)
            .concat(await this.getCommandList(message, unionToArray(commands))));
    }

    async sendModuleCommandHelpMessage(message: Message, moduleId: string, command: string): Promise<void> {
        const prefix: string = await this.commandService.getCommandPrefix(message.guild);

        if (moduleId === 'all') {
            await this.sendCommandHelpMessage(message, command);
            return;
        }
        const modules: UnionArray<Module> = this.moduleService.getModulesByIdOrName(moduleId);

        if (!modules) {
            await this.sendModuleNotFoundHelpMessage(message, moduleId);
            return;
        }
        if (modules instanceof Array) {
            await this.sendMultipleModulesHelpMessage(message, moduleId, modules);
            return;
        }

        const singleCommand: Command = unionToInstance(this.commandService.get(command, modules.moduleInfo.id));

        if (singleCommand) {
            await this.sendCommandUsageMessage(message, singleCommand);
            return;
        }

        const otherMatchingCommands: UnionArray<Command> = this.commandService.get(command);
        if (otherMatchingCommands) {
            await message.channel.send(
                i18n.__('I could not find the command "%s%s" in the module %s (id: %s), but I did find commands in other modules that matched:',
                    prefix, command, modules.moduleInfo.name, modules.moduleInfo.id)
                    .concat(await this.getCommandList(message, unionToArray(otherMatchingCommands), true)));
            return;
        }
        //TODO: stuff here
        await message.channel.send(i18n.__('I could not find the command "%s%s" in the module %s (id: %s).',
            prefix, command, modules.moduleInfo.name, modules.moduleInfo.id));
    }

    async sendCommandHelpMessage(message: Message, command: string): Promise<void> {
        const prefix: string = await this.commandService.getCommandPrefix(message.guild);
        const commands: UnionArray<Command> = this.commandService.get(command);

        if (!commands) {
            await message.reply(i18n.__('I don\'t know the command "%s"!', command));
            return;
        }

        if (commands instanceof Array) {
            const helpMessage: string = i18n.__('Multiple commands matched the given ID %s:', command)
                .concat(await this.getCommandList(message, commands, true)).concat('\r\n')
                .concat(i18n.__('You can find out more by specifying a module ID when you call %shelp:', prefix)).concat('\r\n')
                .concat(i18n.__('> %s%s', prefix, 'help [-c|--command] *command* [-m|--module|--moduleId] *module*')).concat('/r/n')
                .concat(i18n.__('When you execute the command, be sure to specify the module ID as well:')).concat('\r\n')
                .concat(i18n.__('> %s[moduleId]/[command] [parameters]'));
            await message.channel.send(helpMessage);
            return;
        }
        await this.sendCommandUsageMessage(message, commands);
    }

    async sendPermissionDeniedMessage(message: Message): Promise<UnionArray<Message>> {
        return message.reply(i18n.__('unfortunately, you do not have permission to perform that command!'));
    }

    private async sendWelcomeMessage(channel: TextChannel & GuildChannel): Promise<UnionArray<Message>> {
        if(!channel.guild) {
            return null;
        }

        const guildConfiguration: GuildConfiguration = await this.guildConfigurationFactory.load(channel.guild);
        const prefix: string = guildConfiguration.commandPrefix;
        const me: GuildMember = channel.guild.member(this.clientService.user.id);

        const message: string = i18n.__('Hello everyone! %s here.', me.displayName).concat('\r\n')
            .concat(i18n.__('I\'m a configurable modular bot, with a potential variety of functions!')).concat('\r\n')
            .concat(i18n.__('Feel free to ask for `%shelp` if you\'re interested in learning more!', prefix).concat('\r\n')
                .concat(i18n.__('Cheers! %s', await this.configurationService.getRandomHeart())));
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
        const prefix: string = await this.commandService.getCommandPrefix(message.guild);
        let commandEntry: string = i18n.__(this.COMMAND_MODULE_ID_LIST, prefix, command.command);
        if (showModule) {
            const module = this.moduleService.getModuleById(command.moduleId);
            commandEntry = commandEntry.concat(i18n.__(' *from module **%s***', module.moduleInfo.name));
        }
        return commandEntry;
    }

    private async sendCommandUsageMessage(message: Message, command: Command): Promise<void> {
        const prefix: string = await this.commandService.getCommandPrefix(message.guild);
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

        await message.channel.send(i18n.__('Help for command `%s%s`:', prefix, command.command), commandEmbed);
    }

    private async sendModuleHasNoCommandsHelpMessage(message: Message, module: Module): Promise<void> {
        await message.channel.send(i18n.__('The module "%s" (id: %s) does not contain any commands.', module.moduleInfo.name, module.moduleInfo.id));
    }

    private async sendAllModuleListHelpMessage(message: Message): Promise<void> {
        let allModulesHelpMessage: string = i18n.__('The following modules are currently loaded:');
        unionToArray(this.moduleService.getAllModules()).forEach((namedModule: Module) => {
            allModulesHelpMessage = allModulesHelpMessage.concat('\r\n')
                .concat(i18n.__(this.MODULE_ID_LIST_STRING, namedModule.moduleInfo.name, namedModule.moduleInfo.id));
        });
        await message.channel.send(allModulesHelpMessage);
    }

    private async sendModuleNotFoundHelpMessage(message: Message, moduleNameOrId: string): Promise<void> {
        await message.channel.send(i18n.__('There is no module currently loaded with the name or ID "%s".', moduleNameOrId));
    }

    private async sendMultipleModulesHelpMessage(message: Message, moduleName: string, modules: Module[]): Promise<void> {
        let multipleModulesHelpMessage: string = i18n.__('There are currently multiple modules matching the term "%s":', moduleName);
        modules.forEach((namedModule: Module) => {
            multipleModulesHelpMessage = multipleModulesHelpMessage.concat('\r\n')
                .concat(i18n.__(this.MODULE_ID_LIST_STRING, namedModule.moduleInfo.name, namedModule.moduleInfo.id));
        });
        await message.channel.send(multipleModulesHelpMessage);
    }

    private readonly MODULE_ID_LIST_STRING: string = '> • %s (id: %s)';
    private readonly COMMAND_MODULE_ID_LIST: string = '> • %s%s';
}
