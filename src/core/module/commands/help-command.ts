import i18n = require('i18n');
import { Options, Arguments } from 'yargs-parser';
import { Client, Message } from 'discord.js';
import { Command, AppConfiguration, CommandRegistry, Container, SERVICE_IDENTIFIERS, forEachAsync } from 'api';
import * as messages from 'core/messages';

export default class HelpCommand extends Command {
    name: string = 'help';
    command: string = 'help';
    syntax: string[] = [
        'help',
        'help {-a|--all}',
        'help [-c|--command] *command*',
        'help [-m|--moduleId] *moduleId*',
        'help [-c|--command] *command* [-m|--moduleId] *moduleId*'];
    description: string = i18n.__('Provides a detailed overview of any command registered with the bot.');
    options: Options = {
        alias: {
            command: ['-c'],
            all: ['-a'],
            moduleId: ['-m']
        },
        string: ['command','moduleId'],
        configuration: {
            "duplicate-arguments-array": false
        }
    };
    configuration: AppConfiguration;
    commandRegistry: CommandRegistry;

    constructor(moduleId: string) {
        super(moduleId);
        this.configuration = Container.get(SERVICE_IDENTIFIERS.CONFIGURATION);
        this.commandRegistry = Container.get(SERVICE_IDENTIFIERS.COMMAND_REGISTRY);
    }

    async run(client: Client, message: Message, args: Arguments): Promise<any> {
        // TODO: per-guild prefix configuration
        const prefix = this.configuration.defaultPrefix;
        const commands: Command[] = this.commandRegistry.registry;

        if (args._.length === 0 && !(args['all'] || args['command'])) {
            return await messages.sendGeneralHelpMessage(client, message, this.configuration);
        }
        if (args['all']) {
            let helpMessage: string = i18n.__('here\'s a list of all of the commands that I can handle:').concat('\r\n');
            //TODO: Group commands by module id
            await forEachAsync(commands, async (command: Command): Promise<void> => {
                helpMessage = helpMessage.concat('\t•\t').concat(command.name).concat('\r\n');
                return Promise.resolve();
            });
            helpMessage = helpMessage.concat(i18n.__('You can find out more by specifying one command specifically:'))
                .concat('\r\n\t\t').concat(prefix).concat('help [-c|--command] *command*');
            return await message.reply(helpMessage);
        }
        //TODO: Commands specified by module id
        const commandName: string = (args['command'] || args._[0]) as string;
        const command: Command = this.commandRegistry.get(commandName)[0];

        if (command) {
            let helpMessage: string = command.description.concat('\r\n').concat(i18n.__('Usage:')).concat('\r\n');
            await forEachAsync(command.syntax, async (syntax: string, index: number): Promise<void> => {
                if (index > 0) {
                    helpMessage = helpMessage.concat('\r\n');
                }
                helpMessage = helpMessage.concat('\t•\t').concat(prefix).concat(syntax);
            });
            return await message.channel.send(helpMessage);
        }

        return await message.reply(i18n.__('I don\'t know the command').concat(' "').concat(commandName).concat('"!'));
    }

    async checkPermissions(_: Message): Promise<boolean> {
        return Promise.resolve(true);
    }
}
