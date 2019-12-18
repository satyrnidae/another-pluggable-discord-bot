import * as i18n from 'i18n';
import { inject, injectable } from 'inversify';
import { Guild } from 'discord.js';
import { CommandService as ICommandService, ConfigurationService, ServiceIdentifiers } from '/src/api/services';
import { Command } from '/src/api/module';
import { arrayToUnion } from '/src/api/utils';
import { GuildConfiguration } from '/src/db/entity';
import { GuildConfigurationFactory } from '/src/db/factory';

/**
 * A service which maintains references to all registered commands.
 */
@injectable()
export class CommandService implements ICommandService {
    private readonly commands: Command[] = [];

    /**
     * @param configurationService The injected configuration service instance
     * @param guildConfigurationFactory The injected guild configuration factory instance
     */
    constructor(@inject(ServiceIdentifiers.Configuration) private readonly configurationService: ConfigurationService,
        @inject(GuildConfigurationFactory) private readonly guildConfigurationFactory: GuildConfigurationFactory) { }

    public register(command: Command): boolean {
        if (!command.command) {
            console.info(i18n.__('Cannot register an empty command in module "%s".', command.moduleId));
            return false;
        }
        if (this.commands.filter(registeredCommand =>
            registeredCommand.moduleId === command.moduleId &&
            registeredCommand.command === command.command).length) {
            console.info(i18n.__('Skipped registering command "%s:%s" - already registered', command.moduleId, command.command));
            return false;
        }
        this.commands.push(command);
        return true;
    }

    get(command: string, moduleId?: string): UnionArray<Command> {
        const commands: Command[] = [];
        if (moduleId) {
            commands.push(...this.commands.filter(entry => entry.moduleId === moduleId && entry.command === command));
        }
        else {
            commands.push(...this.commands.filter(entry => entry.command === command));
        }
        return arrayToUnion(commands);
    }

    getAll(moduleId?: string): UnionArray<Command> {
        const commands: Command[] = [];
        if (moduleId) {
            commands.push(...this.commands.filter(entry => entry.moduleId === moduleId));
        }
        else {
            commands.push(...this.commands);
        }
        return arrayToUnion(commands);
    }

    async getCommandPrefix(guild: Guild): Promise<string> {
        let prefix: string = await this.configurationService.getDefaultPrefix();
        if (guild) {
            const guildConfiguration: GuildConfiguration = await this.guildConfigurationFactory.load(guild, true);
            prefix = guildConfiguration.commandPrefix;
        }
        return prefix;
    }
}
