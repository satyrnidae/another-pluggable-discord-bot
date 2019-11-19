import i18n = require('i18n');
import { Options, Arguments } from 'yargs-parser';
import { Message } from 'discord.js';
import { Command, forEachAsync, lazyInject, CommandService, ServiceIdentifiers } from 'api';
import { MessageService, CoreModuleServiceIdentifiers } from 'core';

export default class HelpCommand extends Command {
    name: string = 'help';
    command: string = 'help';
    syntax: string[] = [
            'help',
            'help {-a|--all}',
            'help {-m|--module|--moduleId} *moduleId*',
            'help [-c|--command] *command* [[-m|--module|--moduleId] *moduleId*]'
        ];
    description: string = i18n.__('Provides a detailed overview of any command registered with the bot.');
    options: Options = {
        alias: {
            command: ['-c'],
            all: ['-a'],
            moduleId: ['-m','--module']
        },
        string: ['command','moduleId'],
        configuration: {
            'duplicate-arguments-array': false
        }
    };

    @lazyInject(ServiceIdentifiers.Command)
    commandService: CommandService;

    @lazyInject(CoreModuleServiceIdentifiers.Message)
    messageService: MessageService;

    async run(message: Message, args: Arguments): Promise<any> {
        const prefix: string = await this.commandService.getCommandPrefix(message);

        if (args._.length === 0 && !(args['all'] || args['command'])) {
            return this.messageService.sendHelpMessage(message);
        }

        if (args['all']) {
            return this.messageService.sendAllHelpMessage(message);
        }

        let commandName: string;
        let command: Command;
        [commandName, command] = this.getCommand(args);

        if (command) {
            let helpMessage: string = command.description.concat('\r\n').concat(i18n.__('Usage:')).concat('\r\n');
            await forEachAsync(command.syntax, async (syntax: string, index: number): Promise<void> => {
                if (index > 0) {
                    helpMessage = helpMessage.concat('\r\n');
                }
                helpMessage = helpMessage.concat(`\t•\t${prefix}${syntax}`);
            });
            return message.channel.send(helpMessage);
        }

        return message.reply(i18n.__('I don\'t know the command "%s"!', commandName));
    }

    async checkPermissions(): Promise<boolean> {
        return Promise.resolve(true);
    }

    private getCommand(args: Arguments): [string, Command]  {
        let commandName: string = (args['command'] || args._[0]) as string;
        let moduleId: string;
        if(commandName.includes('/')) {
            const commandIdentifiers: string[] = commandName.split('/');
            commandName = commandIdentifiers[1];
            if(!args['moduleId'] || args._[1]) {
                moduleId = commandIdentifiers[0];
            }
        }
        else {
            moduleId = (args['moduleId'] || args._[1]) as string;
        }

        const command: Command = this.commandService.get(commandName, moduleId)[0];
        return [commandName, command];
    }
}
