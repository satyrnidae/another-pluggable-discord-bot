import { Command, EventHandler, ModuleInfo } from 'api';
import { Client } from 'discord.js';

export default abstract class Module {
    public readonly commands: Command[];
    public readonly events: EventHandler[];

    constructor(public moduleInfo: ModuleInfo) {}

    async preInitialize(_: Client): Promise<void> {
        return Promise.resolve();
    }

    async initialize(_: Client): Promise<void> {
        return Promise.resolve();
    }

    async postInitialize(_: Client): Promise<void> {
        return Promise.resolve();
    }
}
