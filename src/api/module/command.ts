import { Message } from 'discord.js';
import { Options, Arguments } from 'yargs-parser';

/**
 * The base class for a Command instance.
 */
export abstract class Command {
    /**
     * The input that the user must match to run the command.
     * */
    readonly abstract command: string;

    /**
     * The friendly, translated name of the command.
     */
    readonly abstract friendlyName: string;

    /**
     * The command usage examples.
     */
    readonly abstract syntax: string[];

    /**
     * The command description.
     */
    readonly abstract description: string;

    /**
     * The command argument parser options.
     */
    readonly abstract options: Options;

    /**
     * @param moduleId The ID of the module to which this command belongs.
     */
    constructor(public readonly moduleId: string) { }

    /**
     * Executes the command functionality.
     * @param message The reference to the message which called this command.
     * @param args The parsed arguments contained in that message.
     */
    abstract run(message: Message, args: Arguments): Promise<void>;

    /**
     * Checks if the command can be executed based on the message which called it.
     * @param message The message which triggered the command execution.
     */
    abstract checkPermissions(message: Message): Promise<boolean>;
}
