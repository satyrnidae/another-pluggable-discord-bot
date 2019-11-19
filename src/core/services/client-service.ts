import * as api from 'api';
import { injectable, inject } from 'inversify';
import { Client } from 'discord.js';
import { ServiceIdentifiers, ConfigurationService } from 'api';

@injectable()
export default class ClientService implements api.ClientService {
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

    constructor(@inject(ServiceIdentifiers.Configuration) public configurationService: ConfigurationService) {
        this.client = new Client();
    }

    async login(): Promise<string> {
        return this.client.login(this.configurationService.token);
    }
}
