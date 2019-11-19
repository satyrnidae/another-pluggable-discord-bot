import { Module } from 'api';

export default interface ModuleService {
    readonly modules: Module[];

    loadModules(): Promise<void>;
    registerDependencies(): Promise<void>;
    preInitializeModules(): Promise<void>;
    initializeModules(): Promise<void>;
    postInitializeModules(): Promise<void>;
}
