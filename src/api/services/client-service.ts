import { Client } from 'discord.js';

export default interface ClientService {
    readonly userId: string;
    readonly username: string;
    readonly userTag: string;
    readonly client: Client;

    login(): Promise<string>;
}