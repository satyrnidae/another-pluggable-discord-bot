import { Guild, Message } from 'discord.js';

export default interface MessageService {
    sendGuildWelcomeMessage(guild: Guild): Promise<any>;

    sendHelpMessage(message: Message): Promise<any>;

    sendAllHelpMessage(message: Message): Promise<any>;

    sendModuleCommandListMessage(message: Message, moduleId: string): Promise<any>;

    sendModuleCommandHelpMessage(message: Message, moduleId: string, command: string): Promise<any>;

    sendCommandHelpMessage(message: Message, command: string): Promise<any>;

    getRandomHeart(): string;
}
