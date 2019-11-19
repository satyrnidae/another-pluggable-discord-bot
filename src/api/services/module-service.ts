export default interface ModuleService {
    loadModules(): Promise<void>;
    registerDependencies(): Promise<void>;
    preInitializeModules(): Promise<void>;
    initializeModules(): Promise<void>;
    postInitializeModules(): Promise<void>;
}
