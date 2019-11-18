import { AppConfiguration, ClientWrapper } from 'api';
import { Guild, Message } from 'discord.js';

export default interface MessageService {
    configuration: AppConfiguration;
    client: ClientWrapper;

    sendGuildWelcomeMessage(guild: Guild): Promise<any>;

    sendHelpMessage(message: Message): Promise<any>;

    getRandomHeart(): string;
}
