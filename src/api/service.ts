import { AppConfiguration } from 'api';
import { Message } from 'discord.js';

export interface CommandService {
    configuration: AppConfiguration;

    getCommandPrefix(message: Message): Promise<string>;
}