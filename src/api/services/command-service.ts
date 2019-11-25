import { Message } from 'discord.js';
import { Command } from 'api/module';

export default interface CommandRegistry {
    readonly commands: Command[];

    register(command: Command, moduleId: string): boolean;
    get(command: string, moduleId?: string): Command[];
    getAll(moduleId?: string): Command[];
    getCommandPrefix(message: Message): Promise<string>;
}
