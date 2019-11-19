import { ClientWrapper, SERVICE_IDENTIFIERS, AppConfiguration, EventHandler } from 'api';
import { Client } from 'discord.js';
import { injectable, inject } from 'inversify';

@injectable()
export default class ClientWrapperBase implements ClientWrapper {
    client: Client;

    get userId(): string {
        return this.client.user.id;
    }

    get username(): string {
        return this.client.user.username;
    }

    get userTag(): string {
        return this.client.user.tag;
    }

    constructor(@inject(SERVICE_IDENTIFIERS.CONFIGURATION) public configuration: AppConfiguration) {
        this.client = new Client();
    }

    async login(): Promise<string> {
        return this.client.login(this.configuration.token);
    }

    registerEvent(event: EventHandler): void {
        this.client.addListener(event.event, event.handler.bind(event));
    }

    on(event: string, listener: Function): void {
        this.client.on(event, listener);
    }
}
