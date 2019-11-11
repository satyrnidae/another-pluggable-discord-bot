import { Client, Message } from 'discord.js';
import { Options, Arguments } from 'yargs-parser';

export default abstract class Command {
    readonly abstract name: string;
    readonly abstract command: string;
    readonly abstract syntax: string[];
    readonly abstract description: string;
    readonly abstract options: Options;

    constructor(public moduleId: string) {}

    abstract run(client: Client, message: Message, args: Arguments): Promise<any>;

    abstract checkPermissions(message: Message): Promise<boolean>;
}
