import { Container } from '/src/api/inversion';
import { Module, Command, ModuleInfo, EventHandler } from '/src/api/module';
import { WebRequestService, MessageService, ModuleConfigurationService, ModuleServiceIdentifiers } from '/src/modules/message-link-embed-module/services';
import { UserSettingsFactory, GuildHistoryFactory, ChannelHistoryFactory, MessageHistoryFactory } from '/src/modules/message-link-embed-module/db/factory';
import { LinkQuoteHandler } from '/src/modules/message-link-embed-module/handlers';

export default class MessageLinkEmbedModule extends Module {

    private readonly _commands: Command[] = [];
    private readonly _events: EventHandler[] = [];

    get commands() {
        return new Array(...this._commands);
    }

    get events() {
        return new Array(...this._events);
    }

    constructor(moduleInfo: ModuleInfo) {
        super(moduleInfo);
        this._commands = [];
        this._events = [
            new LinkQuoteHandler(moduleInfo.id)
        ];
    }

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
}
