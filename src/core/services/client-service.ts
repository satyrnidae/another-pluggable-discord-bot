import * as api from 'api';
import { injectable, inject } from 'inversify';
import { Client, Guild } from 'discord.js';

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
    get guilds(): Guild[] {
        return this.client.guilds.array();
    }

    constructor(@inject(api.ServiceIdentifiers.Configuration) public configurationService: api.ConfigurationService) {
        this.client = new Client();
    }

    async login(): Promise<string> {
        return this.client.login(this.configurationService.token);
    }
}
