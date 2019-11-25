import { injectable, inject } from 'inversify';
import { Client, Guild } from 'discord.js';
import * as sapi from 'api/services';

@injectable()
export default class ClientService implements sapi.ClientService {
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

    constructor(@inject(sapi.ServiceIdentifiers.Configuration) public configurationService: sapi.ConfigurationService) {
        this.client = new Client();
    }

    async login(): Promise<string> {
        return this.client.login(await this.configurationService.getToken());
    }

    getDisplayName(guild?: Guild): string {
        return guild ? guild.me.displayName : this.username;
    }
}
