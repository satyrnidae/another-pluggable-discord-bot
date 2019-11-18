import i18n = require('i18n');
import { injectable } from 'inversify';
import { CommandRegistry, Command } from 'api';

@injectable()
export default class CommandRegistryBase implements CommandRegistry {
    readonly registry: Command[] = [];

    public register(command: Command, moduleId: string): boolean {
        if(!moduleId) {
            console.error(i18n.__('A module attempted to register a command without an ID!'));
        }
        if(!command.command) {
            console.error(i18n.__('Cannot register an empty command in module "%s".', moduleId));
            return false;
        }
        if(this.registry.filter(registeredCommand =>
            registeredCommand.moduleId === moduleId &&
            registeredCommand.command === command.command).length) {
                console.error(i18n.__('Skipped registering command "%s:%s" - already registered', moduleId, command.command));
                return false;
            }

        command.moduleId = moduleId;
        this.registry.push(command);

        return true;
    }

    get(command: string, moduleId?: string): Command[] {
        if(moduleId) {
            return this.registry.filter(entry => entry.moduleId === moduleId && entry.command == command);
        }
        return this.registry.filter(entry => entry.command === command);
    }

    getAll(moduleId?: string): Command[] {
        if(moduleId) {
            return this.registry.filter(entry => entry.moduleId === moduleId);
        }
        return this.registry;
    }
}
