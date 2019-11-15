import { Command } from 'api';

export default interface CommandRegistry {
    readonly registry: Command[];
    register(command: Command, moduleId: string): boolean;
    get(command: string, moduleId?: string): Command[];
    getAll(moduleId?: string): Command[];
}
