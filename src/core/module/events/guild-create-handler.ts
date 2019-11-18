import { EventHandler, lazyInject } from 'api';
import { Client, Guild } from 'discord.js';
import { MessageService } from 'core';

export default class GuildCreateHandler extends EventHandler {
    event: string = 'guildCreate';

    @lazyInject('CoreMessageService')
    messageService: MessageService;

    async handler(_: Client, guild: Guild): Promise<any> {
        //TODO: Set nickname automatically
        return await this.messageService.sendGuildWelcomeMessage(guild);
    }
}
