import i18n = require('i18n');
import { ParsedMessage, parse as ParseMessage } from 'discord-command-parser';
import yparser, { Arguments } from 'yargs-parser';
import { Client, Message } from 'discord.js';
import { CommandRegistry, AppConfiguration, EventHandler, SERVICE_IDENTIFIERS, Command, lazyInject, CommandService, ClientWrapper } from 'api';
import { GuildConfiguration } from 'db';

export default class CommandHander extends EventHandler {
    event: string = 'message';

    @lazyInject(SERVICE_IDENTIFIERS.CLIENT)
    client: ClientWrapper;

    @lazyInject(SERVICE_IDENTIFIERS.COMMAND_REGISTRY)
    commandRegistry: CommandRegistry;

    @lazyInject(SERVICE_IDENTIFIERS.COMMAND_SERVICE)
    commandService: CommandService;

    //TODO: Refactor this exported code from santa bot
    public async handler(message: Message): Promise<any> {
        const prefix: string = await this.commandService.getCommandPrefix(message);
        const parsedCommand: ParsedMessage = ParseMessage(message, prefix);

        if(!parsedCommand.success) {
            return Promise.resolve(false);
        }

        //TODO: Commands by module ID
        const commandArgs: string[] = parsedCommand.arguments;
        const commandValue: string = parsedCommand.command;
        const commands: Command[] = this.commandRegistry.get(commandValue);
        let senderId: string;

        // Gets the ID of the user and the ID of the chat for logging
        if (message.guild) {
            senderId = message.member.displayName.concat('@').concat(message.guild.id).concat(':');
        }
        else {
            senderId = message.author.username.concat('@').concat(this.client.userId).concat(':');
        }

        if (commands.length !== 1) {
            console.warn(senderId, i18n.__('Command'), commandValue, i18n.__('could not be resolved to a single command. (Module collision?)'));
            return Promise.resolve(false);
        }
        const command = commands[0];

        const args: Arguments = yparser(commandArgs, command.options);
        console.debug(senderId, i18n.__('Execute'), commandValue, commandArgs.join(' '));

        // Check perms and execute
        if (await command.checkPermissions(message)) {
            return command.run(message, args);
        }

        return Promise.resolve(false);
    }
}
