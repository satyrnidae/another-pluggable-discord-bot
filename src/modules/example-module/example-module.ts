import { Command, EventHandler, Module } from 'api';

export default class ExampleModule extends Module {
    public async preInitialize(): Promise<void> {
        console.info('[ExampleModule] Pre-Initialization Phase');
        return super.preInitialize();
    }

    public async initialize(): Promise<void> {
        console.info('[ExampleModule] Initialization Phase');
        return super.initialize();
    }

    public async postInitialize() : Promise<void> {
        console.info('[ExampleModule] Post-Initialization Phase');
        return super.postInitialize();
    }

    commands: Command[] = [];

    events: EventHandler[] = [];
}
