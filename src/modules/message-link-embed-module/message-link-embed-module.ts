import { WebRequestService, ModuleServiceIdentifiers, ModuleConfigurationService, MessageService } from 'modules/message-link-embed-module/services';
import { LinkQuoteHandler } from 'modules/message-link-embed-module/handlers';
import { Container } from 'api/inversion';
import { Module, Command, EventHandler } from 'api/module';
import { UserSettingsFactory, GuildHistoryFactory, ChannelHistoryFactory, MessageHistoryFactory } from 'modules/message-link-embed-module/db/factory';

export default class MessageLinkEmbedModule extends Module {

    async registerDependencies(): Promise<void> {
        Container.bind<WebRequestService>(ModuleServiceIdentifiers.WebRequest).to(WebRequestService);
        Container.bind<MessageService>(ModuleServiceIdentifiers.Message).to(MessageService);
        Container.bind<ModuleConfigurationService>(ModuleServiceIdentifiers.Configuration).to(ModuleConfigurationService);

        Container.bind<UserSettingsFactory>(UserSettingsFactory).toSelf();
        Container.bind<GuildHistoryFactory>(GuildHistoryFactory).toSelf();
        Container.bind<ChannelHistoryFactory>(ChannelHistoryFactory).toSelf();
        Container.bind<MessageHistoryFactory>(MessageHistoryFactory).toSelf();

        return super.registerDependencies();
    }

    async preInitialize(): Promise<void> {
        this.events = [
            new LinkQuoteHandler()
        ];
        return super.preInitialize();
    }

    commands: Command[] = [];

    events: EventHandler[] = [];
}
