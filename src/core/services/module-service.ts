import * as i18n from 'i18n';
import { inject, injectable } from 'inversify';
import { ModuleService as IModuleService, ServiceIdentifiers, EventService, CommandService } from '/src/api/services';
import { Module, Command, EventHandler, ModuleInfo, Version } from '/src/api/module';
import { FsAsync, forEachAsync, arrayToUnion } from '/src/api/utils';

const MODULE_DIRECTORY = `${__dirname}/../../modules`;

@injectable()
export class ModuleService implements IModuleService {
    private readonly modules: Module[] = [];

    constructor(
        @inject(ServiceIdentifiers.Event) public eventService: EventService,
        @inject(ServiceIdentifiers.Command) public commandService: CommandService) { }

    async loadModules(): Promise<void> {
        this.loadCore();

        const moduleFolders: string[] = await FsAsync.readDirAsync(MODULE_DIRECTORY);

        return forEachAsync(moduleFolders, async (moduleFolder: string) => this.loadModule(moduleFolder));
    }

    async registerDependencies(): Promise<void> {
        return forEachAsync(this.modules, async (module: Module) => module.registerDependencies());
    }

    async preInitializeModules(): Promise<void> {
        return forEachAsync(this.modules, async (module: Module) => module.preInitialize());
    }

    async initializeModules(): Promise<void> {
        return forEachAsync(this.modules, async (module: Module) => {
            await module.initialize();
            if (module.commands) {
                module.commands.forEach((command: Command) => this.commandService.register(command));
            }
            if (module.events) {
                module.events.forEach((event: EventHandler) => this.eventService.registerEvent(event));
            }
        });
    }

    async postInitializeModules(): Promise<void> {
        return forEachAsync(this.modules, async (module: Module) => module.postInitialize());
    }

    private loadCore(): void {
        this.modules.push(new CoreModule());
    }

    private async loadModule(moduleFolder: string): Promise<void> {
        try {
            const modulePath = `${MODULE_DIRECTORY}/${moduleFolder}`;
            if (!(await FsAsync.lstatAsync(modulePath)).isDirectory) {
                console.info(i18n.__('Skipped non directory "%s".', moduleFolder));
                return;
            }
            const moduleFiles: string[] = await FsAsync.readDirAsync(modulePath);
            const moduleConfigFile = moduleFiles.filter((file: string) => file.match(/^module\.json$/))[0];
            if (!moduleConfigFile) {
                console.info(i18n.__('Module "%s" is missing a module config file and has been skipped.', moduleFolder));
                return;
            }
            const moduleInfo: ModuleInfo = JSON.parse((await FsAsync.readFileAsync(`${modulePath}/${moduleConfigFile}`)).toString()) as ModuleInfo;
            if (!moduleInfo) {
                console.info(i18n.__('Module "%s"\'s module info file cannot be read, and the module has been skipped.', moduleFolder));
                return;
            }
            //TODO: More robust versioning
            if (moduleInfo.details.apiVersion.toLowerCase().trim() !== Version.toLowerCase().trim()) {
                console.info(i18n.__('Module "%s" was made for a different version of this bot and has been skipped.', moduleInfo.name));
                return;
            }
            let moduleEntryPointFile = `${modulePath}/${moduleInfo.details.entryPoint}.ts`;
            if (!await FsAsync.existsAsync(moduleEntryPointFile)) {
                moduleEntryPointFile = `${modulePath}/${moduleInfo.details.entryPoint}.js`;
                if (!await FsAsync.existsAsync(moduleEntryPointFile)) {
                    console.info(i18n.__('The entry point "%s" for module "%s" could not be found and the module has been skipped.',
                        moduleInfo.details.entryPoint, moduleInfo.name));
                    return;
                }
            }
            const moduleEntryPointImport: any = require(moduleEntryPointFile);
            const module: Module = new moduleEntryPointImport.default(moduleInfo) as Module;
            if (!module) {
                console.info(i18n.__('Failed to initialize module instance for "%s". The module has been skipped.', moduleInfo.name));
                return;
            }

            this.modules.push(module);
            console.info(i18n.__('Found module "%s".', moduleInfo.name));
        }
        catch (ex) {
            console.info(i18n.__('An unexpected error occurred while loading module "%s": %s', moduleFolder, ex));
        }
    }

    getAllModules(): UnionArray<Module> {
        const modules = new Array(...this.modules);
        return arrayToUnion(modules);
    }

    getModuleById(moduleId: string): Module {
        const filteredModules: Module[] = this.modules.filter((module: Module) => module.moduleInfo.id === moduleId);
        return filteredModules && filteredModules.length ? filteredModules[0] : null;
    }

    getModulesByName(moduleName: string): UnionArray<Module> {
        const modules = new Array(...this.modules.filter((module: Module) => module.moduleInfo.name === moduleName));
        return arrayToUnion(modules);
    }

    getModulesByIdOrName(moduleIdOrName: string): UnionArray<Module> {
        const module: Module = this.getModuleById(moduleIdOrName);
        if (!module) {
            return this.getModulesByName(moduleIdOrName);
        }
        return module;
    }
}
