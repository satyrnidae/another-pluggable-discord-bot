import { Client } from 'discord.js';
import { AppConfiguration, EventHandler } from 'api';

export default interface ClientWrapper {
    client: Client;
    configuration: AppConfiguration;
    readonly userId: string;
    readonly username: string;
    readonly userTag: string;
    login(): Promise<string>;
    registerEvent(event: EventHandler): void;
    on(event: string, listener: Function): void;
}
