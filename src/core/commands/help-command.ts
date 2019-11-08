import i18n = require('i18n');
import { Options, Arguments } from 'yargs-parser';
import { Client, Message } from 'discord.js';
import { Command, Configuration, CommandRegistry, Container, SERVICE_IDENTIFIERS } from 'api';
import { sendGeneralHelpMessage } from 'core';

/**
 * A command which will provide help information about the bot, the available commands, and information on specific commands.
 */
export default class HelpCommand extends Command {
    /** The name of the command; in this case, "help", localized */
    name: string = 'help';
    command: string = 'help';
    /** The syntax of the command */
    syntax: string[] = [
        'help',
        'help {-a|--all}',
        'help [-c|--command] *command*',
        'help [-m|--moduleId] *moduleId*',
        'help [-c|--command] *command* [-m|--moduleId] *moduleId*'];
    /** The command description */
    description: string = i18n.__('Provides a detailed overview of any command registered with the bot.');
    /** The command parser options */
    options: Options = {
        alias: {
            command: ['-c'],
            all: ['-a'],
            moduleId: ['-m']
        },
        string: ['command'],
        configuration: {
            "duplicate-arguments-array": false
        }
    };
    configuration: Configuration;
    commandRegistry: CommandRegistry;

    constructor(moduleId: string) {
        super(moduleId);
        this.configuration = Container.get(SERVICE_IDENTIFIERS.CONFIGURATION);
        this.commandRegistry = Container.get(SERVICE_IDENTIFIERS.COMMAND_REGISTRY);
    }

    /**
     * Executes the command.
     * @param client The discord client instance
     * @param message The message within which the command data resides
     * @param args The parsed yargs arguments of the command
     */
    run(client: Client, message: Message, args: Arguments): any {
        var commands = this.commandRegistry.registry;
        var prefix = this.configuration.defaultPrefix;

        if (args._.length == 0 && !args['all'] && !args['command']) {
            return sendGeneralHelpMessage(client, message, this.configuration);
        }

        if (args['all']) {
            var helpMessage: string = i18n.__("here's a list of all of the commands I can handle").concat(':\r\n');
            //TODO: By Module
            commands.forEach(command => {
                helpMessage = helpMessage.concat('\t•\t`').concat(command.name).concat('`:\r\n');
            });
            helpMessage = helpMessage.concat(i18n.__("You can find out more by specifying one command specifically")).concat(':\r\n\t\t')
                .concat(prefix).concat('help [-c|--command] *command*');
            return message.reply(helpMessage);
        }

        var commandName = (args['command'] || args._[0]) as string;
        var command = this.commandRegistry.get(commandName)[0];

        if (command) {
            var helpMessage: string = command.description.concat('\r\n')
                .concat(i18n.__('Usage')).concat(':\r\n');
            command.syntax.forEach((option, i) => {
                if (i > 0)
                    helpMessage = helpMessage.concat('\r\n');
                helpMessage = helpMessage.concat('\t•\t').concat(prefix).concat(option);
            });
            return message.channel.send(helpMessage);
        }

        return message.reply(i18n.__("I don't know the command").concat(' "').concat(commandName).concat('"!'));
    }

    /**
     * Always returns true, as any user can ask for help
     */
    checkPermissions(_: Message): boolean {
        return true;
    }
}
