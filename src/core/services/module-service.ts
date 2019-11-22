import * as i18n from 'i18n';
import * as api from 'api';
import { inject, id, injectable } from 'inversify';
import CoreModule from 'core/module/core-module';

const MODULE_DIRECTORY = `${__dirname}/../../modules`;

@injectable()
export default class ModuleService implements api.ModuleService {
    readonly modules: api.Module[] = [];

    constructor(
        @inject(api.ServiceIdentifiers.Event) public eventService: api.EventService,
        @inject(api.ServiceIdentifiers.Command) public commandService: api.CommandService) {}

    async loadModules(): Promise<void> {
        this.loadCore();

        const moduleFolders: string[] = await api.readDirAsync(MODULE_DIRECTORY);

        return api.forEachAsync(moduleFolders, async (moduleFolder: string) => this.loadModule(moduleFolder));
    }

    async registerDependencies(): Promise<void> {
        return api.forEachAsync(this.modules, async (module: api.Module) => module.registerDependencies());
    }

    async preInitializeModules(): Promise<void> {
        return api.forEachAsync(this.modules, async (module: api.Module) => module.preInitialize());
    }

    async initializeModules(): Promise<void> {
        return api.forEachAsync(this.modules, async (module: api.Module) => {
            await module.initialize();
            if(module.commands) {
                module.commands.forEach((command: api.Command) => this.commandService.register(command, module.moduleInfo.id));
            }
            if(module.events) {
                module.events.forEach((event: api.EventHandler) => this.eventService.registerEvent(event));
            }
        });
    }

    async postInitializeModules(): Promise<void> {
        return api.forEachAsync(this.modules, async (module: api.Module) => module.postInitialize());
    }

    private loadCore(): void {
        this.modules.push(new CoreModule());
    }

    private async loadModule(moduleFolder: string): Promise<void> {
        try {
            const modulePath = `${MODULE_DIRECTORY}/${moduleFolder}`;
            if (!(await api.lstatAsync(modulePath)).isDirectory) {
                console.info(i18n.__('Skipped non directory "%s".', moduleFolder));
                return;
            }
            const moduleFiles: string[] = await api.readDirAsync(modulePath);
            const moduleConfigFile = moduleFiles.filter((file: string) => file.match(/^module\.json$/))[0];
            if (!moduleConfigFile) {
                console.info(i18n.__('Module "%s" is missing a module config file and has been skipped.', moduleFolder));
                return;
            }
            const moduleInfo: api.ModuleInfo = JSON.parse((await api.readFileAsync(`${modulePath}/${moduleConfigFile}`)).toString()) as api.ModuleInfo;
            if (!moduleInfo) {
                console.info(i18n.__('Module "%s"\'s module info file cannot be read, and the module has been skipped.', moduleFolder));
                return;
            }
            //TODO: More robust versioning
            if (moduleInfo.details.apiVersion.toLowerCase().trim() !== api.Version.toLowerCase().trim()) {
                console.info(i18n.__('Module "%s" was made for a different version of this bot and has been skipped.', moduleInfo.name));
                return;
            }
            let moduleEntryPointFile = `${modulePath}/${moduleInfo.details.entryPoint}.ts`;
            if (!await api.existsAsync(moduleEntryPointFile)) {
                moduleEntryPointFile = `${modulePath}/${moduleInfo.details.entryPoint}.js`;
                if (!await api.existsAsync(moduleEntryPointFile)) {
                    console.info(i18n.__('The entry point "%s" for module "%s" could not be found and the module has been skipped.',
                        moduleInfo.details.entryPoint, moduleInfo.name));
                    return;
                }
            }
            const moduleEntryPointImport: any = require(moduleEntryPointFile);
            const module: api.Module = new moduleEntryPointImport.default(moduleInfo) as api.Module;
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

    getModuleById(moduleId: string): api.Module {
        const filteredModules: api.Module[] = this.modules.filter((module: api.Module) => module.moduleInfo.id === moduleId);
        return filteredModules && filteredModules.length ? filteredModules[0] : null;
    }

    getModulesByName(moduleName: string): api.Module[] {
        return this.modules.filter((module: api.Module) => module.moduleInfo.name === moduleName);
    }

    getModulesByIdOrName(moduleIdOrName: string): api.Module[] {
        const module: api.Module = this.getModuleById(moduleIdOrName);
        if (!module) {
            return this.getModulesByName(moduleIdOrName);
        }
        return [module];
    }
}
