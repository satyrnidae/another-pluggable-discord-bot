import { Client } from 'discord.js';
import { Command, EventHandler, Module } from 'api';

export default class ExampleModule extends Module {
    public async preInitialize(): Promise<void> {
        console.info('[ExampleModule] Pre-Initialization Phase');
        return await super.preInitialize();
    }

    public async initialize(): Promise<void> {
        console.info('[ExampleModule] Initialization Phase');
        return await super.initialize();
    }

    public async postInitialize() : Promise<void> {
        console.info('[ExampleModule] Post-Initialization Phase');
        return await super.postInitialize();
    }

    get commands(): Command[] {
        return [];
    }

    get events(): EventHandler[] {
        return [];
    }
}
