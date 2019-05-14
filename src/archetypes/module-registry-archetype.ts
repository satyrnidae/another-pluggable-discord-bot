import * as fs from 'fs';
import * as api from '../../api';
import { ModuleRegistry, Module, ModuleInfo } from "../../api/modules";
import { injectable } from "inversify";
import { Client } from 'discord.js';
import { CommandRegistry } from '../../api/entity';

@injectable()
export default class ModuleRegistryArchetype implements ModuleRegistry {
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
                if(moduleInfo.details.apiVersion.toLowerCase().trim() != api.Version.toLowerCase().trim()) {
                    return console.warn(i18n.__('Module "%s" was not created against the correct API version (expected %s; got %s)', item, api.Version, moduleInfo.details.apiVersion));
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
        return modules;
    }

    preInitializeModules(modules: Module[]): Module[] {
        modules.forEach(module => module.preInitialize());
        return modules;
    }

    initializeModules(client: Client, commandRegistry: CommandRegistry, modules: Module[]): Module[] {
        modules.forEach(module => {
            module.initialize();
            if (module.events) {
                module.events.forEach(event => client.addListener(event.name, event.handle));
            }
            if (module.commands) {
                module.commands.forEach(command => commandRegistry.register(module, command))
            }
        });
        return modules;
    }

    postInitializeModules(client: Client, modules: Module[]): Module[] {
        modules.forEach(module => module.postInitialize(client));
        return modules;
    }

}