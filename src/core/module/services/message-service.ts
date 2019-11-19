import { Guild, Message } from 'discord.js';

export default interface MessageService {
    sendGuildWelcomeMessage(guild: Guild): Promise<any>;

    sendHelpMessage(message: Message): Promise<any>;

    sendAllHelpMessage(message: Message): Promise<any>;

    getRandomHeart(): string;
}
