import { ParsedMessage, parse as ParseMessage } from 'discord-command-parser';
import { Client, Message } from 'discord.js';
import { CommandRegistry, Configuration, Container, EventHandler, SERVICE_IDENTIFIERS } from 'api';

export default class CommandHander extends EventHandler {
    event: string = "message";
    configuration: Configuration;
    commandRegistry: CommandRegistry;

    constructor(moduleId: string) {
        super(moduleId);
        this.configuration = Container.get(SERVICE_IDENTIFIERS.CONFIGURATION);
        this.commandRegistry = Container.get(SERVICE_IDENTIFIERS.COMMAND_REGISTRY);
    }

    handler(_: Client, message: Message): boolean {
        const prefix: string = this.configuration.defaultPrefix; //TODO: Custom prefixes
        const parsedCommand: ParsedMessage = ParseMessage(message, prefix);

        if(!parsedCommand.success) return false;

        console.log(`Parsed Command ${parsedCommand.command}`);

        return true;
    }


}