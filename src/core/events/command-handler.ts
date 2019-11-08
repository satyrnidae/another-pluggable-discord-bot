import i18n = require('i18n');
import { ParsedMessage, parse as ParseMessage } from 'discord-command-parser';
import yparser from 'yargs-parser'
import { Client, Message } from 'discord.js';
import { CommandRegistry, Configuration, Container, EventHandler, SERVICE_IDENTIFIERS, Command } from 'api';

export default class CommandHander extends EventHandler {
    event: string = "message";
    configuration: Configuration;
    commandRegistry: CommandRegistry;

    constructor(moduleId: string) {
        super(moduleId);
        this.configuration = Container.get(SERVICE_IDENTIFIERS.CONFIGURATION);
        this.commandRegistry = Container.get(SERVICE_IDENTIFIERS.COMMAND_REGISTRY);
    }

    //TODO: Refactor this exported code from santa bot
    handler(client: Client, message: Message): boolean {
        const prefix: string = this.configuration.defaultPrefix; //TODO: Custom prefixes
        const parsedCommand: ParsedMessage = ParseMessage(message, prefix);

        if(!parsedCommand.success) return false;

        const commandArgs = parsedCommand.arguments;
        var commandValue = parsedCommand.command;
        var commands: Command[] = this.commandRegistry.get(commandValue);

        var senderId: string

        // Gets the ID of the user and the ID of the chat for logging
        if (message.guild) {
            senderId = message.member.displayName.concat('@').concat(message.guild.id).concat(':')
        }
        else {
            senderId = message.author.username.concat('@').concat(client.user.id).concat(':')
        }

        if (commands.length != 1) {
            console.warn(senderId, i18n.__("Command"), commandValue, i18n.__("did not exist in the list of registered commands (prefix collision?)"))
            return false;
        }
        const command = commands[0]

        var p_argv = yparser(commandArgs, command.options)
        console.debug(senderId, i18n.__("Execute"), commandValue, commandArgs.join(" "))

        // Check perms and execute
        if (command.checkPermissions(message)) {
            command.run(client, message, p_argv)
        }
    }


}