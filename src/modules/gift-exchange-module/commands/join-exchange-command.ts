import { Message } from 'discord.js';
import { Options, Arguments } from 'yargs-parser';
import { Command } from 'api/module';

export class JoinExchangeCommand extends Command {
    readonly command: string;
    readonly syntax: string[];
    readonly description: string;
    readonly options: Options;

    async run(message: Message, args: Arguments): Promise<void> {
        
    }

    async checkPermissions(message: Message): Promise<boolean> {
        return true;
    }
}
