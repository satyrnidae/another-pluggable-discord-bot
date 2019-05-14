import { Client } from 'discord.js';

export default interface EventHandler {
    name: string | symbol;

    handle(client: Client, ...args: any[]): boolean;
}