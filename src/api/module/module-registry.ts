import { Client } from 'discord.js';

export default interface ModuleRegistry {

    loadModules(): Promise<void>;

    preInitializeModules(): Promise<void>;

    initializeModules(): Promise<void>;

    postInitializeModules(): Promise<void>;
}
