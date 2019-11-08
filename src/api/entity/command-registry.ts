import { Command } from 'api/entity';

/**
 * Holds a registry of each command object by name.  This interface supports
 * inversion via `api/inversion/container`.
 * @author satyrnidae🌙🦋
 * @since 0.0.1a
 */
export default interface CommandRegistry {

    readonly registry: Command[];

    register(command: Command, moduleId: string): boolean;

    get(command: string, moduleId: string): Command[];

    getAll(moduleId?: string): Command[];
}