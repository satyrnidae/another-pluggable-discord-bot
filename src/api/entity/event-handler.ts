import { Client } from 'discord.js';

export default abstract class EventHandler {
    readonly abstract event: string;

    constructor(public moduleId: string) {}

    abstract handler(client: Client, ...args: any[]): boolean;
}