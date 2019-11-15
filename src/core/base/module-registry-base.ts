import i18n = require('i18n');
import * as fs from 'fs';
import * as api from 'api';
import { CoreModule } from 'core';
import { injectable } from 'inversify';
import { Client } from 'discord.js';

@injectable()
export default class ModuleRegistryBase implements api.ModuleRegistry {
    public readonly modules: api.Module[] = [];
    private readonly moduleDirectory: string = `${__dirname}/../../modules`;

    public async loadModules(): Promise<void> {
        const moduleDirs: string[] = fs.readdirSync(this.moduleDirectory);
        await this.loadCore();
        return await api.forEachAsync(moduleDirs, async (item: string) : Promise<any> => {
            try {
                const modulePath: string = `${this.moduleDirectory}/${item}`
                if (!fs.lstatSync(modulePath).isDirectory) {
                    console.warn(i18n.__('Skipped non-directory "%s".', item));
                    return Promise.resolve();
                }

                const moduleFiles: string[] = fs.readdirSync(modulePath);
                const moduleConfigFile: string = moduleFiles.filter((file: string) => file.match(/^module\.json$/))[0];
                if (!moduleConfigFile) {
                    console.warn(i18n.__('Module "%s" is not a valid module.', item));
                    return Promise.resolve();
                }

                const moduleInfo: api.ModuleInfo = JSON.parse(fs.readFileSync(`${modulePath}/${moduleConfigFile}`).toString()) as api.ModuleInfo;
                if (!moduleInfo) {
                    console.warn(i18n.__('Module "%s" information file is not in the proper format.', item));
                    return Promise.resolve();
                }
                if (moduleInfo.details.apiVersion.toLowerCase().trim() !== api.Version.toLowerCase().trim()) {
                    console.warn(i18n.__('Module "%s" was not made for the correct API version (expected: "%s"; got: "%s"', item, api.Version));
                    return Promise.resolve();
                }

                let entryPoint: string = `${modulePath}/${moduleInfo.details.entryPoint}.ts`;
                if (!fs.existsSync(entryPoint)) {
                    entryPoint = `${modulePath}/${moduleInfo.details.entryPoint}.js`;
                    if (!fs.existsSync(entryPoint)) {
                        console.warn(i18n.__('Failed to load entry point for module "%s".'), item);
                        return Promise.resolve();
                    }
                }

                const moduleEntryPoint: any = require(entryPoint);
                const moduleInstance: api.Module = new moduleEntryPoint.default(moduleInfo) as api.Module;
                if (!moduleInstance) {
                    console.warn(i18n.__('Failed to load module "%s" instance.', item));
                    return Promise.resolve();
                }

                this.modules.push(moduleInstance);
            }
            catch (ex) {
                console.error(i18n.__('An unexpected error occurred while loading module "%s": %s', item, ex));
            }
            return Promise.resolve();
        });
    }

    public async preInitializeModules(client: Client): Promise<void> {
        return await api.forEachAsync(this.modules, async (module: api.Module) => await module.preInitialize(client));
    }

    public async initializeModules(client: Client): Promise<void> {
        var commandRegistry: api.CommandRegistry = api.Container.get<api.CommandRegistry>(api.SERVICE_IDENTIFIERS.COMMAND_REGISTRY);
        return await api.forEachAsync(this.modules, async (module: api.Module) => {
            await module.initialize(client);
            if (module.commands) {
                module.commands.forEach((command: api.Command) => commandRegistry.register(command, module.moduleInfo.id));
            }
            if (module.events) {
                module.events.forEach((event: api.EventHandler) => client.addListener(event.event, event.handler.bind(event, client)));
            }
            return Promise.resolve();
        });
    }

    public async postInitializeModules(client: Client): Promise<void> {
        return await api.forEachAsync(this.modules, async (module: api.Module) => await module.postInitialize(client));
    }

    private async loadCore() : Promise<void> {
        const coreModule = new CoreModule();
        this.modules.push(coreModule)

        return Promise.resolve();
    }
}
