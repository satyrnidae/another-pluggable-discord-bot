import { Module } from '/src/api/module';

/**
 * A service which provides access to all loaded modules
 */
export interface ModuleService {

    /**
     * Loads all compiled modules in the modules directory
     */
    loadModules(): Promise<void>;

    /**
     * Registers dependencies to the IOC container for all modules
     */
    registerDependencies(): Promise<void>;

    /**
     * Fires the pre-initialization stage for all modules
     */
    preInitializeModules(): Promise<void>;

    /**
     * Fires the initialization stage for all modules
     */
    initializeModules(): Promise<void>;

    /**
     * Fires the post-initialization stage for all modules
     */
    postInitializeModules(): Promise<void>;

    /**
     * Gets a list of all loaded modules.
     */
    getAllModules(): Module[];

    /**
     * Gets a single module by ID
     * @param moduleId The module ID to search for.
     */
    getModuleById(moduleId: string): Module;

    /**
     * Gets a module or modules by name.
     * @param moduleName The module name to search for.
     */
    getModulesByName(moduleName: string): UnionArray<Module>;

    /**
     * Gets a module or modules by name or ID.
     * @param moduleIdOrName The module ID or module name to search for.
     */
    getModulesByIdOrName(moduleIdOrName: string): UnionArray<Module>;
}
