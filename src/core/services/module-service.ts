import i18n = require('i18n');
import fs from 'fs';
import * as api from 'api';
import { inject, id, injectable } from 'inversify';
import { CoreModule } from 'core/module';
import { Module } from 'api';

@injectable()
export default class ModuleService implements api.ModuleService {
    readonly modules: api.Module[] = [];
    private readonly moduleDirectory: string = `${__dirname}/../../modules`;

    constructor(
        @inject(api.ServiceIdentifiers.Event) public eventService: api.EventService,
        @inject(api.ServiceIdentifiers.Command) public commandService: api.CommandService) {}

    async loadModules(): Promise<void> {
        this.loadCore();

        const moduleFolders: string[] = fs.readdirSync(this.moduleDirectory);
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

    private loadModule(moduleFolder: string): void {
        try {
            const modulePath: string = `${this.moduleDirectory}/${moduleFolder}`;
            if (!fs.lstatSync(modulePath).isDirectory) {
                console.info(i18n.__('Skipped non directory "%s".', moduleFolder));
                return;
            }
            const moduleFiles: string[] = fs.readdirSync(modulePath);
            const moduleConfigFile = moduleFiles.filter((file: string) => file.match(/^module\.json$/))[0];
            if (!moduleConfigFile) {
                console.info(i18n.__('Module "%s" is missing a module config file and has been skipped.', moduleFolder));
                return;
            }
            const moduleInfo: api.ModuleInfo = JSON.parse(fs.readFileSync(`${modulePath}/${moduleConfigFile}`).toString()) as api.ModuleInfo;
            if (!moduleInfo) {
                console.info(i18n.__('Module "%s"\'s module info file cannot be read, and the module has been skipped.', moduleFolder));
                return;
            }
            //TODO: More robust versioning
            if (moduleInfo.details.apiVersion.toLowerCase().trim() !== api.Version.toLowerCase().trim()) {
                console.info(i18n.__('Module "%s" was made for a different version of this bot and has been skipped.', moduleInfo.name));
                return;
            }
            let moduleEntryPointFile: string = `${modulePath}/${moduleInfo.details.entryPoint}.ts`;
            if (!fs.existsSync(moduleEntryPointFile)) {
                moduleEntryPointFile = `${modulePath}/${moduleInfo.details.entryPoint}.js`;
                if (!fs.existsSync(moduleEntryPointFile)) {
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

    getModuleById(moduleId: string): Module {
        const filteredModules: Module[] = this.modules.filter((module: Module) => module.moduleInfo.id === moduleId);
        return filteredModules && filteredModules.length ? filteredModules[0] : null;
    }

    getModulesByName(moduleName: string): Module[] {
        return this.modules.filter((module: Module) => module.moduleInfo.name == moduleName);
    }

    getModulesByIdOrName(moduleIdOrName: string): Module[] {
        const module: Module = this.getModuleById(moduleIdOrName);
        if (!module) {
            return this.getModulesByName(moduleIdOrName);
        }
        return [module];
    }
}
