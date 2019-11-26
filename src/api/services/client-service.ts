import { Client, Guild } from 'discord.js';

export default interface ClientService {
    readonly userId: string;
    readonly username: string;
    readonly userTag: string;
    readonly client: Client;
    readonly guilds: Guild[];

    login(): Promise<string>;
    getDisplayName(guild?: Guild): string;
}
