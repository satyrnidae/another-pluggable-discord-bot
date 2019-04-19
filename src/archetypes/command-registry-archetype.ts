import Enmap from 'enmap';
import { injectable } from 'inversify';
import { CommandRegistry, Command } from '../../api/entity';

@injectable()
export default class CommandRegistryArchetype implements CommandRegistry {
    commands: Enmap<string, Command>;    
    
    register(command: Command): Enmap<string, Command> {
        const commandName: string = command.name.toLowerCase().trim();
        if(this.commands.has(commandName)) {
            throw i18n.__("The command %s was already registered.", commandName);
        }
        return this.commands.set(commandName, command);
    }
    
    get(name: string): Command {
        return this.commands.get(name.toLowerCase().trim());
    }
    
    getAll(): Command[] {
        var commands: Command[] = [];
        this.commands.forEach(command => commands.push(command));
        return commands;
    }

    
}