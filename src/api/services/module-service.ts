import { Module } from 'api/module';

export default interface ModuleService {
    readonly modules: Module[];

    loadModules(): Promise<void>;
    registerDependencies(): Promise<void>;
    preInitializeModules(): Promise<void>;
    initializeModules(): Promise<void>;
    postInitializeModules(): Promise<void>;
    getModuleById(moduleId: string): Module;
    getModulesByName(moduleName: string): Module[];
    getModulesByIdOrName(moduleIdOrName: string): Module[];
}
