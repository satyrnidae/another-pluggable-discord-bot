import * as i18n from 'i18n';
import { Message } from 'discord.js';
import { Options, Arguments } from 'yargs-parser';
import { Command } from '/src/api/module';

export class JoinExchangeCommand extends Command {
    readonly friendlyName: string = i18n.__('Join Exchange');
    readonly command: string = 'joinexchange';
    readonly syntax: string[] = [];
    readonly description: string = i18n.__('Allows a user to join an exchange in the current guild.');
    readonly options: Options = {};

    async run(message: Message, args: Arguments): Promise<void> {

    }

    async checkPermissions(message: Message): Promise<boolean> {
        return true;
    }
}
