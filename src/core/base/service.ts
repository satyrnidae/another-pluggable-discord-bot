import { CommandService, AppConfiguration, SERVICE_IDENTIFIERS } from 'api';
import { Message } from 'discord.js';
import { inject, injectable } from 'inversify';
import { GuildConfiguration } from 'db';

@injectable()
export class CommandServiceBase implements CommandService {

    constructor(@inject(SERVICE_IDENTIFIERS.CONFIGURATION) public configuration: AppConfiguration) {}

    async getCommandPrefix(message: Message): Promise<string> {
        let prefix: string = this.configuration.defaultPrefix;
        if(message.guild) {
            const guildConfiguration: GuildConfiguration = await GuildConfiguration.load(message.guild);
            prefix = guildConfiguration.commandPrefix;
        }
        return prefix;
    }
}