import { ClientWrapper, SERVICE_IDENTIFIERS, AppConfiguration, EventHandler } from "api";
import { Client } from "discord.js";
import { injectable, inject } from "inversify";

@injectable()
export default class ClientWrapperBase implements ClientWrapper {
    client: Client;

    get userId(): string {
        return this.client.user.id;
    }

    get username(): string {
        return this.client.user.username;
    }

    constructor(@inject(SERVICE_IDENTIFIERS.CONFIGURATION) public configuration: AppConfiguration) {
        this.client = new Client();
    }

    async login(): Promise<string> {
        return await this.client.login(this.configuration.token);
    }

    registerEvent(event: EventHandler): void {
        this.client.addListener(event.event, event.handler.bind(event, this.client));
    }
}