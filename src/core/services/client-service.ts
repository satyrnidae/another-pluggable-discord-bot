import { injectable, inject } from 'inversify';
import { Client, Guild, User } from 'discord.js';
import { ClientService as IClientService, ConfigurationService, ServiceIdentifiers} from '/src/api/services';

/**
 * A service which provides access to a client instance.
 */
@injectable()
export class ClientService implements IClientService {
    client: Client;

    get user(): User {
        return this.client.user;
    }

    get guilds(): Guild[] {
        return this.client.guilds.array();
    }

    /**
     * @param configurationService The injected configuration service instance
     */
    constructor(@inject(ServiceIdentifiers.Configuration) private readonly configurationService: ConfigurationService) {
        this.client = new Client();
    }

    async login(): Promise<string> {
        return this.client.login(await this.configurationService.getToken());
    }

    getDisplayName(guild?: Guild): string {
        if (guild) {
            const member = guild.member(this.user);
            if (member) {
                return member.displayName;
            }
        }

        return this.user.username;
    }
}
