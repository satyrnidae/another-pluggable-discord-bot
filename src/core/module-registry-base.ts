import * as fs from 'fs';
import { ModuleRegistry, CommandRegistry, Command, Container, EventHandler, Module, ModuleInfo, Version, forEachAsync, SERVICE_IDENTIFIERS } from "api";
import { CoreModule } from 'core';
import { injectable } from "inversify";
import { Client } from 'discord.js';

@injectable()
export default class ModuleRegistryBase implements ModuleRegistry {
    moduleDirectory: string = `${__dirname}/../../modules`;

    async loadModules(): Promise<Module[]> {
        const modules: Module[] = [];
        const moduleDirs: string[] = fs.readdirSync(this.moduleDirectory);
        moduleDirs.forEach(item => {
            try {
                const modulePath = `${this.moduleDirectory}/${item}`;
                if(!fs.lstatSync(modulePath).isDirectory) {
                    console.warn(i18n.__('Skipped non-directory file "%s".', item));
                    return [];
                }
                var moduleConfig = fs.readdirSync(modulePath).filter(fn => fn.match(/^module\.json$/))[0];
                if(!moduleConfig) {
                    return console.warn(i18n.__('Module "%s" is not a valid module.', item));
                }
                var moduleInfo = JSON.parse(fs.readFileSync(`${modulePath}/${moduleConfig}`).toString()) as ModuleInfo;
                if(!moduleInfo) {
                    return console.warn(i18n.__('Module "%s" information file is not in the proper format.', item));
                }
                if(moduleInfo.details.apiVersion.toLowerCase().trim() != Version.toLowerCase().trim()) {
                    return console.warn(i18n.__('Module "%s" was not created against the correct API version (expected %s; got %s)', item, Version, moduleInfo.details.apiVersion));
                }
                let entryPoint = `${modulePath}/${moduleInfo.details.entryPoint}.ts`;
                if(!fs.existsSync(entryPoint)) {
                    entryPoint = `${modulePath}/${moduleInfo.details.entryPoint}.js`;
                    if(!fs.existsSync(entryPoint)) {
                        return console.warn(i18n.__('Failed to load entry point for module "%s"', item));
                    }
                }
                const moduleEntryPoint = require(entryPoint);
                const moduleInstance = new moduleEntryPoint.default(moduleInfo) as Module;
                if(!moduleInstance) {
                    return console.warn(i18n.__('Failed to load module "%s" instance', item));
                }
                modules.push(moduleInstance);
            } catch (ex) {
                return console.error(i18n.__('An unexpected error occurred while loading module %s: %s', item, ex));
            }
        });
        await this.loadCore(modules);
        return modules;
    }
    async loadCore(modules: Module[]) : Promise<void> {
        const coreModuleInfo: ModuleInfo = {
            name: "Core Module",
            version: "1.0.0",
            id: "core-module",
            authors: [
                "satyrnidae"
            ],
            details: {
                apiVersion: Version,
                entryPoint: "core-module",
                commands: [],
                eventHandlers: []
            }
        };
        const coreModule = new CoreModule(coreModuleInfo);

        modules.push(coreModule)

        return Promise.resolve();
    }

    async preInitializeModules(modules: Module[]): Promise<Module[]> {
        await forEachAsync(modules, async (module: Module) => await module.preInitialize());
        return modules;
    }

    async initializeModules(client: Client, modules: Module[]): Promise<Module[]> {
        var commandRegistry: CommandRegistry = Container.get<CommandRegistry>(SERVICE_IDENTIFIERS.COMMAND_REGISTRY);
        await forEachAsync(modules, async (module: Module) => {
            await module.initialize();
            if (module.commands) {
                module.commands.forEach((command: Command) => commandRegistry.register(command, module.moduleInfo.id));
            }
            if (module.events) {
                module.events.forEach((event: EventHandler) => client.addListener(event.event, event.handler.bind(event, client)));
            }
            return Promise.resolve();
        });
        return modules;
    }

    async postInitializeModules(client: Client, modules: Module[]): Promise<Module[]> {
        await forEachAsync(modules, async (module: Module) => await module.postInitialize(client));
        return modules;
    }

}