import { EventHandler, Container, SERVICE_IDENTIFIERS, DBConnection, AppConfiguration } from 'api';
import { Client, Guild } from 'discord.js';
import { GuildConfiguration } from 'db';
import { sendGuildWelcomeMessage } from 'core/messages';

export default class GuildCreateHandler implements EventHandler {
    event: string = 'guildCreate';

    dbConnection: DBConnection;
    configuration: AppConfiguration;

    constructor(public moduleId: string) {
        this.dbConnection = Container.get(SERVICE_IDENTIFIERS.DB_CONNECTION);
        this.configuration = Container.get(SERVICE_IDENTIFIERS.CONFIGURATION);
    }

    async handler(client: Client, guild: Guild, ...args: any[]): Promise<any> {
        return await sendGuildWelcomeMessage(client, guild);
    }


}