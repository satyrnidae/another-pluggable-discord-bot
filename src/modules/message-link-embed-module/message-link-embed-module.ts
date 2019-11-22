import { Command, EventHandler, Module, Container } from 'api';
import { WebRequestService, ModuleServiceIdentifiers, ModuleConfigurationService, MessageService } from 'modules/message-link-embed-module/services';
import { LinkQuoteHandler } from 'modules/message-link-embed-module/handlers';

export default class MessageLinkEmbedModule extends Module {

    async registerDependencies(): Promise<void> {
        Container.bind<WebRequestService>(ModuleServiceIdentifiers.WebRequest).to(WebRequestService);
        Container.bind<MessageService>(ModuleServiceIdentifiers.Message).to(MessageService);
        Container.bind<ModuleConfigurationService>(ModuleServiceIdentifiers.Configuration).to(ModuleConfigurationService);
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
