import i18n = require('i18n');
import fs from 'fs';
import * as api from 'api';
import { Module, ServiceIdentifiers, ConfigurationService, ClientService, EventService, CommandService, ModuleInfo, Version, forEachAsync, Command, EventHandler } from 'api';
import { inject, id } from 'inversify';
import { CoreModule } from 'core/module';

export default class ModuleService implements api.ModuleService {
    readonly modules: Module[] = [];
    private readonly moduleDirectory: string = `${__dirname}/../../modules`;

    constructor(
        @inject(ServiceIdentifiers.Event) public eventService: EventService,
        @inject(ServiceIdentifiers.Command) public commandService: CommandService) {}

    async loadModules(): Promise<void> {
        this.loadCore();

        const moduleFolders: string[] = fs.readdirSync(this.moduleDirectory);
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
            if(module.commands) {
                module.commands.forEach((command: Command) => this.commandService.register(command, module.moduleInfo.id));
            }
            if(module.events) {
                module.events.forEach((event: EventHandler) => this.eventService.registerEvent(event));
            }
        })
    }

    async postInitializeModules(): Promise<void> {
        return forEachAsync(this.modules, async (module: Module) => module.postInitialize());
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
            const moduleInfo: ModuleInfo = JSON.parse(fs.readFileSync(`${modulePath}/${moduleConfigFile}`).toString()) as ModuleInfo;
            if (!moduleInfo) {
                console.info(i18n.__('Module "%s"\'s module info file cannot be read, and the module has been skipped.', moduleFolder));
                return;
            }
            //TODO: More robust versioning
            if (moduleInfo.details.apiVersion.toLowerCase().trim() !== Version.toLowerCase().trim()) {
                console.info(i18n.__('Module "%s" was made for a different version of this bot and has been skipped.', moduleInfo.name));
                return;
            }
            let moduleEntryPointFile: string = `${modulePath}/${moduleInfo.details.entryPoint}.ts`;
            if (!fs.existsSync(moduleEntryPointFile)) {
                moduleEntryPointFile = `${modulePath}/${moduleInfo.details.entryPoint}.js`;
                if (!fs.existsSync(moduleEntryPointFile)) {
                    console.info(i18n.__('The entry point "%s" for module "%s" could not be found and the module has been skipped.', moduleInfo.details.entryPoint, moduleInfo.name));
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
            console.error(i18n.__('An unexpected error occurred while loading module "%s": %s', moduleFolder, ex));
        }
    }
}
