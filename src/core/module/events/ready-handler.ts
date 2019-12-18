import * as i18n from 'i18n';
import { Guild } from 'discord.js';
import { EventHandler } from '/src/api/module';
import { lazyInject } from '/src/api/inversion';
import { CoreModuleServiceIdentifiers, MessageService } from '/src/core/module/services';
import { ServiceIdentifiers, ClientService, EventService } from '/src/api/services';
import { forEachAsync } from '/src/api/utils';

export class ReadyHandler extends EventHandler {
    readonly event = 'ready';

    @lazyInject(CoreModuleServiceIdentifiers.Message)
    private readonly messageService: MessageService;

    @lazyInject(ServiceIdentifiers.Client)
    private readonly clientService: ClientService;

    @lazyInject(ServiceIdentifiers.Event)
    private readonly eventService: EventService;

    public async handler(): Promise<void> {
        this.eventService.on('error', (e: string) => console.info(e));
        this.eventService.on('warn', (w: string) => console.info(w));
        this.eventService.on('info', (i: string) => console.info(i));

        console.info(i18n.__('Logged in as %s, and ready for service!', this.clientService.user.tag));

        await forEachAsync(this.clientService.guilds, async (guild: Guild) => this.messageService.sendGuildWelcomeMessage(guild));
    }
}
