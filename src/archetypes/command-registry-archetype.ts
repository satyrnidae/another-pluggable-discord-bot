import Enmap from 'enmap';
import { injectable } from 'inversify';
import { CommandRegistry, Command } from '../../api/entity';
import { Module } from '../../api/modules';

@injectable()
export default class CommandRegistryArchetype implements CommandRegistry {
    readonly registry: Enmap<string, Enmap<string, Command>> = new Enmap();

    register(parentModule: Module, command: Command): boolean {
        const commandName: string = command.name.toLowerCase().trim();
        const moduleId: string = parentModule.moduleInfo.id ? parentModule.moduleInfo.id : "";

        let commandMap = this.registry.get(moduleId);
        if(!commandMap) {
            commandMap = new Enmap<string, Command>();
            this.registry.set(moduleId, commandMap);
        }
        if(commandMap.has(commandName)) {
            console.error(i18n.__("The command %s:%s was already registered.", moduleId, commandName));
            return false;
        }

        commandMap.set(command.name, command);
        return true;
    }

    get(name: string, moduleId?: string): Command[] {
        if(moduleId) {
            let commandList: Enmap<string, Command> = this.registry.get(moduleId);
            return [commandList.get(name)];
        }

        const commands: Command[] = [];

        this.registry.forEach(registryEntry => {
            var item = registryEntry.get(name);
            if(item) commands.push(item);
        });

        return commands;
    }

    getAll(moduleId?: string): Command[] {
        var commands: Command[] = [];

        if(moduleId) {
            this.registry.get(moduleId).forEach(command => commands.push(command));
        } else {
            this.registry.forEach(registryEntry => registryEntry.forEach(command => commands.push(command)));
        }

        return commands;
    }


}