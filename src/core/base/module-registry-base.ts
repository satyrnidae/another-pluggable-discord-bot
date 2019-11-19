import i18n = require('i18n');
import * as fs from 'fs';
import * as api from 'api';
import { CoreModule } from 'core';
import { injectable, inject } from 'inversify';

@injectable()
export default class ModuleRegistryBase implements api.ModuleRegistry {
    public readonly modules: api.Module[] = [];

    //TODO: Remove this hardcoded relpath somehow
    private readonly moduleDirectory: string = `${__dirname}/../../modules`;

    constructor(
        @inject(api.SERVICE_IDENTIFIERS.CONFIGURATION) public appConfiguration: api.AppConfiguration,
        @inject(api.SERVICE_IDENTIFIERS.CLIENT) public client: api.ClientWrapper,
        @inject(api.SERVICE_IDENTIFIERS.COMMAND_REGISTRY) public commandRegistry: api.CommandRegistry) {}

    async loadModules(): Promise<void> {
        const moduleDirs: string[] = fs.readdirSync(this.moduleDirectory);
        this.loadCore();
        return api.forEachAsync(moduleDirs, async (moduleDir: string): Promise<void> => this.loadModule(moduleDir));
    }

    async registerDependencies() : Promise<void> {
        return api.forEachAsync(this.modules, async (module: api.Module) => module.registerDependencies());
    }

    async preInitializeModules(): Promise<void> {
        return api.forEachAsync(this.modules, async (module: api.Module) => module.preInitialize());
    }

    async initializeModules(): Promise<void> {
        const commandRegistry: api.CommandRegistry = api.Container.get<api.CommandRegistry>(api.SERVICE_IDENTIFIERS.COMMAND_REGISTRY);
        return api.forEachAsync(this.modules, async (module: api.Module) => {
            await module.initialize();
            if (module.commands) {
                module.commands.forEach((command: api.Command) => commandRegistry.register(command, module.moduleInfo.id));
            }
            if (module.events) {
                module.events.forEach((event: api.EventHandler) => this.client.registerEvent(event));
            }
        });
    }

    async postInitializeModules(): Promise<void> {
        return api.forEachAsync(this.modules, async (module: api.Module): Promise<void> => module.postInitialize());
    }

    private loadCore() : void {
        const coreModule = new CoreModule();
        this.modules.push(coreModule);
    }

    private loadModule(moduleDir: string): void {
        try {
            const modulePath: string = `${this.moduleDirectory}/${moduleDir}`;
            if (!fs.lstatSync(modulePath).isDirectory) {
                console.warn(i18n.__('Skipped non-directory "%s".', moduleDir));
                return;
            }

            const moduleFiles: string[] = fs.readdirSync(modulePath);
            const moduleConfigFile: string = moduleFiles.filter((file: string) => file.match(/^module\.json$/))[0];
            if (!moduleConfigFile) {
                console.warn(i18n.__('Module "%s" is not a valid module.', moduleDir));
                return;
            }

            const moduleInfo: api.ModuleInfo = JSON.parse(fs.readFileSync(`${modulePath}/${moduleConfigFile}`).toString()) as api.ModuleInfo;
            if (!moduleInfo) {
                console.warn(i18n.__('Module "%s" information file is not in the proper format.', moduleDir));
                return;
            }
            if (moduleInfo.details.apiVersion.toLowerCase().trim() !== api.Version.toLowerCase().trim()) {
                console.warn(i18n.__('Module "%s" was not made for the correct API version (expected: "%s"; got: "%s")', moduleDir, api.Version));
                return;
            }

            let entryPoint: string = `${modulePath}/${moduleInfo.details.entryPoint}.ts`;
            if (!fs.existsSync(entryPoint)) {
                entryPoint = `${modulePath}/${moduleInfo.details.entryPoint}.js`;
                if (!fs.existsSync(entryPoint)) {
                    console.warn(i18n.__('Failed to load entry point for module "%s".'), moduleDir);
                    return;
                }
            }

            const moduleEntryPoint: any = require(entryPoint);
            const moduleInstance: api.Module = new moduleEntryPoint.default(moduleInfo) as api.Module;
            if (!moduleInstance) {
                console.warn(i18n.__('Failed to load module "%s" instance.', moduleDir));
                return;
            }

            this.modules.push(moduleInstance);
        }
        catch (ex) {
            console.error(i18n.__('An unexpected error occurred while loading module "%s": %s', moduleDir, ex));
        }
    }
}
