import Enmap from 'enmap';
import { Command } from '.';
import { Module } from '../modules';

/**
 * Holds a registry of each command object by name.  This interface supports
 * inversion via `api/inversion/container`.
 * @author satyrnidae🌙🦋
 * @since 0.0.1a
 */
export default interface CommandRegistry {

    /**
     * The command registry.  Each identifier in this map is set to the ID of a
     * loaded module, or, if the command is a global command, it will be set to
     * an empty string.  Each value is a list of commands by name.  Each command
     * name must be unique by module.
     */
    readonly registry: Enmap<string, Enmap<string, Command>>;

    /**
     * Registers a command for the specified module.
     * @param parentModule The parent module.  The ID is pulled from the
     * module's `moduleInfo` property.  If unspecified, or `parentModule` is
     * `null`, the ID will be set to an empty string and the command will be
     * registered globally.
     * @param command The command instance to register. Each `command`'s name
     * must be unique per-module.
     */
    register(parentModule: Module, command: Command): boolean;

    /**
     * Gets a command by name.
     * @param name The name of the command.
     * @param moduleId Optionally filters commands by module.  If unspecified,
     * all modules will be searched.
     */
    get(name: string, moduleId?: string): Command[];

    /**
     * Gets all commands, either for a specific module or globally.
     * @param moduleId Optionally filters commands by module.  If unspecified,
     * all modules will be searched.
     */
    getAll(moduleId?: string): Command[];
}