import * as i18n from 'i18n';
import { ParsedMessage, parse as ParseMessage } from 'discord-command-parser';
import yparser, { Arguments } from 'yargs-parser';
import { Message } from 'discord.js';
import { EventHandler, Command } from 'api/module';
import { lazyInject } from 'api/inversion';
import { ServiceIdentifiers, CommandService, ConfigurationService } from 'api/services';

export default class CommandHander extends EventHandler {
    event = 'message';

    @lazyInject(ServiceIdentifiers.Configuration)
    configurationService: ConfigurationService;

    @lazyInject(ServiceIdentifiers.Command)
    commandService: CommandService;

    public async handler(message: Message): Promise<any> {
        let prefix: string = await this.commandService.getCommandPrefix(message);
        let parsedCommand: ParsedMessage = ParseMessage(message, prefix);

        if(!parsedCommand.success) {
            prefix = await this.configurationService.getDefaultPrefix();
            parsedCommand = ParseMessage(message, prefix);
            if(!parsedCommand || parsedCommand.command !== 'help') {
                return false;
            }
        }

        //TODO: Commands by module ID
        const commandArgs: string[] = parsedCommand.arguments;
        const commandValue: string = parsedCommand.command;
        const commands: Command[] = this.commandService.get(commandValue);
        let senderId: string;

        // Gets the ID of the user and the ID of the chat for logging
        if (message.guild) {
            senderId = message.member.displayName.concat('@').concat(message.guild.name).concat(':');
        }
        else {
            senderId = message.author.tag.concat(':');
        }

        if (commands.length !== 1) {
            console.info(senderId, i18n.__('Command'), commandValue, i18n.__('could not be resolved to a single command. (Module collision?)'));
            return false;
        }
        const command = commands[0];

        const args: Arguments = yparser(commandArgs, command.options);
        console.debug(senderId, i18n.__('Execute'), commandValue, commandArgs.join(' '));

        // Check perms and execute
        if (await command.checkPermissions(message)) {
            return command.run(message, args);
        }
        //TODO: Message when perms fail

        return false;
    }
}
