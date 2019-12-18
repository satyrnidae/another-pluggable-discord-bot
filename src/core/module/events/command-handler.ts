import * as i18n from 'i18n';
import { ParsedMessage, parse as ParseMessage } from 'discord-command-parser';
import yparser, { Arguments } from 'yargs-parser';
import { Message } from 'discord.js';
import { MessageEventHandler, Command } from '/src/api/module';
import { ServiceIdentifiers, ConfigurationService, CommandService } from '/src/api/services';
import { lazyInject } from '/src/api/inversion';
import { CoreModuleServiceIdentifiers, MessageService } from '/src/core/module/services';

export class CommandHandler extends MessageEventHandler {

    @lazyInject(ServiceIdentifiers.Configuration)
    private readonly configurationService: ConfigurationService;

    @lazyInject(ServiceIdentifiers.Command)
    private readonly commandService: CommandService;

    @lazyInject(CoreModuleServiceIdentifiers.Message)
    private readonly messageService: MessageService;

    public async handler(message: Message): Promise<void> {
        let prefix: string = await this.commandService.getCommandPrefix(message.guild);
        let parsedCommand: ParsedMessage = ParseMessage(message, prefix);

        if(!parsedCommand.success) {
            prefix = await this.configurationService.getDefaultPrefix();
            parsedCommand = ParseMessage(message, prefix);
            if(!parsedCommand || parsedCommand.command !== 'help') {
                return;
            }
        }

        //TODO: Commands by module ID
        const commandArgs: string[] = parsedCommand.arguments;
        const commandValue: string = parsedCommand.command;
        const commands: UnionArray<Command> = this.commandService.get(commandValue);
        let senderId: string;

        // Gets the ID of the user and the ID of the chat for logging
        if (message.guild) {
            senderId = message.member.displayName.concat('@').concat(message.guild.name).concat(':');
        }
        else {
            senderId = message.author.tag.concat(':');
        }

        if (commands instanceof Array) {
            console.info(senderId, i18n.__('Command'), commandValue, i18n.__('could not be resolved to a single command. (Module collision?)'));
            return;
        }

        const args: Arguments = yparser(commandArgs, commands.options);
        console.debug(senderId, i18n.__('Execute'), commandValue, commandArgs.join(' '));

        // Check perms and execute
        if (!await commands.checkPermissions(message)) {
            this.messageService.sendPermissionDeniedMessage(message);
            return;
        }
        commands.run(message, args);
    }
}
