import { Command, EventHandler, ModuleInfo } from 'api/module';

export default abstract class Module {
    public readonly commands: Command[];
    public readonly events: EventHandler[];

    constructor(public moduleInfo: ModuleInfo) {}

    async registerDependencies(): Promise<void> {
        return Promise.resolve();
    }

    async preInitialize(): Promise<void> {
        return Promise.resolve();
    }

    async initialize(): Promise<void> {
        return Promise.resolve();
    }

    async postInitialize(): Promise<void> {
        return Promise.resolve();
    }
}
