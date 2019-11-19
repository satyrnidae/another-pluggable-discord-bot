import i18n = require('i18n');
import { EventHandler, forEachAsync, lazyInject, SERVICE_IDENTIFIERS, ClientWrapper } from 'api';
import { Client, Guild } from 'discord.js';
import { MessageService } from 'core';

export default class ReadyHandler extends EventHandler {
    event: string = 'ready';

    @lazyInject('CoreMessageService')
    messageService: MessageService;
    @lazyInject(SERVICE_IDENTIFIERS.CLIENT)
    clientService: ClientWrapper;

    public async handler(client: Client, ..._args: any[]): Promise<any> {
        this.clientService.on('error', (e: string) => console.error(e));
        this.clientService.on('warn', (w: string) => console.warn(w));
        this.clientService.on('info', (i: string) => console.info(i));

        console.log(i18n.__('Logged in as %s, and ready for service!', this.clientService.userTag));

        return forEachAsync(client.guilds.array(), async (guild: Guild): Promise<any> => this.messageService.sendGuildWelcomeMessage(guild));
    }
}
