import { Message } from 'discord.js';
import { Options, Arguments } from 'yargs-parser';

export default abstract class Command {
    readonly abstract command: string;
    readonly abstract syntax: string[];
    readonly abstract description: string;
    readonly abstract options: Options;

    constructor(public moduleId: string) {}

    abstract run(message: Message, args: Arguments): Promise<any>;
    abstract checkPermissions(message: Message): Promise<boolean>;
}
