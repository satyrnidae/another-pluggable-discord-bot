import i18n = require('i18n');
import { EventHandler, forEachAsync, lazyInject, ServiceIdentifiers, ClientService, EventService } from 'api';
import { Guild } from 'discord.js';
import { MessageService, CoreModuleServiceIdentifiers } from 'core/module/services';

export default class ReadyHandler extends EventHandler {
    event: string = 'ready';

    @lazyInject(CoreModuleServiceIdentifiers.Message)
    messageService: MessageService;

    @lazyInject(ServiceIdentifiers.Client)
    clientService: ClientService;

    @lazyInject(ServiceIdentifiers.Event)
    eventService: EventService;

    public async handler(): Promise<any> {
        this.eventService.on('error', (e: string) => console.info(e));
        this.eventService.on('warn', (w: string) => console.info(w));
        this.eventService.on('info', (i: string) => console.info(i));

        console.info(i18n.__('Logged in as %s, and ready for service!', this.clientService.userTag));

        return forEachAsync(this.clientService.guilds, async (guild: Guild): Promise<any> => this.messageService.sendGuildWelcomeMessage(guild));
    }
}
