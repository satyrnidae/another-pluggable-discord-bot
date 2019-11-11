import { Client } from 'discord.js';
import { Command, EventHandler, Module } from 'api';

export default class ExampleModule extends Module {
    public async preInitialize(client: Client): Promise<void> {
        console.info('[ExampleModule] Pre-Initialization Phase');
        return await super.preInitialize(client);
    }

    public async initialize(client: Client): Promise<void> {
        console.info('[ExampleModule] Initialization Phase');
        return await super.initialize(client);
    }

    public async postInitialize(client: Client) : Promise<void> {
        console.info('[ExampleModule] Post-Initialization Phase');
        return await super.postInitialize(client);
    }

    get commands(): Command[] {
        return [];
    }

    get events(): EventHandler[] {
        return [];
    }
}
