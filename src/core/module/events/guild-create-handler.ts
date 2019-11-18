import { EventHandler, Container, SERVICE_IDENTIFIERS, DBConnection, AppConfiguration, lazyInject } from 'api';
import { Client, Guild } from 'discord.js';
import { MessageService } from 'core';

export default class GuildCreateHandler extends EventHandler {
    event: string = 'guildCreate';

    @lazyInject('CoreMessageService')
    messageService: MessageService;

    async handler(_: Client, guild: Guild): Promise<any> {
        return await this.messageService.sendGuildWelcomeMessage(guild);
    }


}