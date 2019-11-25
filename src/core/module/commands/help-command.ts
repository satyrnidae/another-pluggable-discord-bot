import * as i18n from 'i18n';
import { Options, Arguments } from 'yargs-parser';
import { Message } from 'discord.js';
import { MessageService, CoreModuleServiceIdentifiers } from 'core/module/services';
import { Command } from 'api/module';
import { lazyInject } from 'api/inversion';

export default class HelpCommand extends Command {
    name = 'help';
    command = 'help';
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
        boolean: ['all'],
        configuration: {
            'duplicate-arguments-array': false
        }
    };

    @lazyInject(CoreModuleServiceIdentifiers.Message)
    messageService: MessageService;

    async run(message: Message, args: Arguments): Promise<any> {
        const allParam: boolean = this.isAllParamPresent(args);
        const commandParam: string = this.getCommandNameParam(args);
        const moduleIdParam: string = this.getModuleIdParam(args);

        if (allParam) {
            return this.messageService.sendAllHelpMessage(message);
        }

        if (commandParam === undefined) {
            if (moduleIdParam === undefined) {
                return this.messageService.sendHelpMessage(message);
            }
            return this.messageService.sendModuleCommandListMessage(message, moduleIdParam);
        }

        if(moduleIdParam === undefined) {
            return this.messageService.sendCommandHelpMessage(message, commandParam);
        }

        return this.messageService.sendModuleCommandHelpMessage(message, moduleIdParam, commandParam);
    }

    private isAllParamPresent(args: Arguments): boolean {
        return args['all'] !== undefined && args['all'] || args._.length && args._[0] === 'all';
    }

    private getCommandNameParamRaw(args: Arguments) {
        if (this.isAllParamPresent(args)) {
            return '';
        }
        if (args['command']) {
            return args['command'];
        }
        return args._.length ? args._[0] : undefined;
    }

    private getCommandNameParam(args: Arguments): string {
        if (this.isAllParamPresent(args)) {
            return '';
        }
        const commandName: string = this.getCommandNameParamRaw(args);
        if (commandName && commandName.includes('/')) {
            return commandName.split('/')[1];
        }
        return commandName;
    }

    private getModuleIdParam(args: Arguments): string {
        if (this.isAllParamPresent(args)) {
            return '';
        }
        if (args['moduleId']) {
            return args['moduleId'];
        }
        const commandName: string = this.getCommandNameParamRaw(args);
        if(commandName && commandName.includes('/')) {
            return commandName.split('/')[0];
        }
        if(args['command']) {
            return args._.length ? args._[0] : undefined;
        }
        return args._.length > 1 ? args._[1] : undefined;
    }

    async checkPermissions(): Promise<boolean> {
        return true;
    }
}
