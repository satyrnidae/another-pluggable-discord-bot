import * as i18n from 'i18n';
import * as sapi from 'api/services';
import { inject, injectable } from 'inversify';
import { Message } from 'discord.js';
import { Command } from 'api/module';
import { GuildConfiguration } from 'db/entity';
import { GuildConfigurationFactory } from 'db/factory';

@injectable()
export default class CommandService implements sapi.CommandService {
    readonly commands: Command[] = [];

    constructor(@inject(sapi.ServiceIdentifiers.Configuration) public configurationService: sapi.ConfigurationService) {}

    public register(command: Command, moduleId: string): boolean {
        if(!moduleId) {
            console.info(i18n.__('A module attempted to register a command without an ID!'));
        }
        if(!command.command) {
            console.info(i18n.__('Cannot register an empty command in module "%s".', moduleId));
            return false;
        }
        if(this.commands.filter(registeredCommand =>
            registeredCommand.moduleId === moduleId &&
            registeredCommand.command === command.command).length) {
                console.info(i18n.__('Skipped registering command "%s:%s" - already registered', moduleId, command.command));
                return false;
            }

        command.moduleId = moduleId;
        this.commands.push(command);

        return true;
    }

    get(command: string, moduleId?: string): Command[] {
        if(moduleId) {
            return this.commands.filter(entry => entry.moduleId === moduleId && entry.command === command);
        }
        return this.commands.filter(entry => entry.command === command);
    }

    getAll(moduleId?: string): Command[] {
        if(moduleId) {
            return this.commands.filter(entry => entry.moduleId === moduleId);
        }
        return this.commands;
    }

    async getCommandPrefix(message: Message): Promise<string> {
        let prefix: string = await this.configurationService.getDefaultPrefix();
        if(message.guild) {
            const guildConfiguration: GuildConfiguration = await new GuildConfigurationFactory().load(message.guild);
            prefix = guildConfiguration.commandPrefix;
        }
        return prefix;
    }
}
