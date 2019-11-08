import { Client } from 'discord.js';

export default abstract class EventHandler {
    readonly abstract name: string | symbol;

    constructor(public moduleId: string | symbol) {}

    abstract handle(client: Client, ...args: any[]): boolean;
}