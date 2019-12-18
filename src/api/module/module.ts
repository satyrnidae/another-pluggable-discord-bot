import { Command } from '/src/api/module/command';
import { EventHandler } from '/src/api/module/event-handler';
import { ModuleInfo } from '/src/api/module/module-info';

/**
 * The base class for a module implementation.
 */
export abstract class Module {
    /**
     * A list of commands which are provided by this module.
     */
    public readonly commands: Command[];

    /**
     * A list of events which should be registered to this module.
     */
    public readonly events: EventHandler[];

    /**
     * @param moduleInfo The parsed information from the associated module info file.
     */
    constructor(public readonly moduleInfo: ModuleInfo) { }

    /**
     * Registers any dependencies to the IOC container
     */
    async registerDependencies(): Promise<void> { }

    /**
     * Pre-initialization stage for the module.
     */
    async preInitialize(): Promise<void> { }

    /**
     * Initialization stage for the module.
     */
    async initialize(): Promise<void> { }

    /**
     * Post-initialization stage for the module.
     */
    async postInitialize(): Promise<void> { }
}
