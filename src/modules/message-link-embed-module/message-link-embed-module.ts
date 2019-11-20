import { Command, EventHandler, Module, ModuleInfo } from 'api';
import { LinkQuoteHandler } from 'modules/message-link-embed-module/handlers';

export default class MessageLinkEmbedModule extends Module {

    public async preInitialize(): Promise<void> {
        this.events = [
            new LinkQuoteHandler()
        ];
        return super.preInitialize();
    }

    commands: Command[] = [];

    events: EventHandler[] = [];
}
