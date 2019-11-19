import i18n = require('i18n');
import * as api from 'api';
import { inject } from 'inversify';
import { Message } from 'discord.js';
import { GuildConfiguration, GuildConfigurationFactory } from 'db';

export default class CommandService implements api.CommandService {
    readonly commands: api.Command[] = [];

    constructor(@inject(api.ServiceIdentifiers.Configuration) public configurationService: api.ConfigurationService) {}

    public register(command: api.Command, moduleId: string): boolean {
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

    get(command: string, moduleId?: string): api.Command[] {
        if(moduleId) {
            return this.commands.filter(entry => entry.moduleId === moduleId && entry.command === command);
        }
        return this.commands.filter(entry => entry.command === command);
    }

    getAll(moduleId?: string): api.Command[] {
        if(moduleId) {
            return this.commands.filter(entry => entry.moduleId === moduleId);
        }
        return this.commands;
    }

    async getCommandPrefix(message: Message): Promise<string> {
        let prefix: string = this.configurationService.defaultPrefix;
        if(message.guild) {
            const guildConfiguration: GuildConfiguration = await new GuildConfigurationFactory().load(message.guild);
            prefix = guildConfiguration.commandPrefix;
        }
        return prefix;
    }
}
