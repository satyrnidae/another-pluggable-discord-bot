import i18n = require('i18n');
import { ParsedMessage, parse as ParseMessage } from 'discord-command-parser';
import yparser, { Arguments } from 'yargs-parser'
import { Client, Message } from 'discord.js';
import { CommandRegistry, AppConfiguration, EventHandler, SERVICE_IDENTIFIERS, Command, lazyInject } from 'api';
import { GuildConfiguration } from 'db';

export default class CommandHander extends EventHandler {
    event: string = 'message';

    @lazyInject(SERVICE_IDENTIFIERS.CONFIGURATION)
    configuration: AppConfiguration;
    @lazyInject(SERVICE_IDENTIFIERS.COMMAND_REGISTRY)
    commandRegistry: CommandRegistry;

    //TODO: Refactor this exported code from santa bot
    public async handler(client: Client, message: Message): Promise<any> {
        let prefix: string = this.configuration.defaultPrefix;
        if (message.guild) {
            const guildConfig: GuildConfiguration = await GuildConfiguration.load(message.guild);
            prefix = guildConfig.commandPrefix;
        }

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
            senderId = message.author.username.concat('@').concat(client.user.id).concat(':');
        }

        if (commands.length !== 1) {
            console.warn(senderId, i18n.__('Command'), commandValue, i18n.__('could not be resolved to a single command. (Module collision?)'));
            return Promise.resolve(false);
        }
        const command = commands[0];

        const p_argv: Arguments = yparser(commandArgs, command.options);
        console.debug(senderId, i18n.__('Execute'), commandValue, commandArgs.join(' '));

        // Check perms and execute
        if (await command.checkPermissions(message)) {
            return await command.run(client, message, p_argv);
        }

        return Promise.resolve(false);
    }
}
