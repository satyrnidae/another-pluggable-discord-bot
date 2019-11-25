import { Command, EventHandler, Module } from 'api';

export default class ExampleModule extends Module {
    public async preInitialize(): Promise<void> {
        return super.preInitialize();
    }

    public async initialize(): Promise<void> {
        return super.initialize();
    }

    public async postInitialize() : Promise<void> {
        return super.postInitialize();
    }

    commands: Command[] = [];

    events: EventHandler[] = [];
}