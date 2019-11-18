import { Client } from 'discord.js';

export default interface ModuleRegistry {

    loadModules(): Promise<void>;

    registerDependencies(): Promise<void>;

    preInitializeModules(): Promise<void>;

    initializeModules(): Promise<void>;

    postInitializeModules(): Promise<void>;
}
