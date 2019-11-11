import { Command, EventHandler } from 'api/entity';
import { ModuleInfo } from 'api/modules';
import { Client } from 'discord.js';


export default abstract class Module {
    constructor(public moduleInfo: ModuleInfo) {}

    async preInitialize(client: Client): Promise<void> {
        return Promise.resolve();
    }

    async initialize(client: Client): Promise<void> {
        return Promise.resolve();
    }

    async postInitialize(client: Client): Promise<void> {
        return Promise.resolve();
    }

    readonly commands: Command[];

    readonly events: EventHandler[];
}
