import { EventHandler, lazyInject, ServiceIdentifiers, ClientService } from 'api';
import { Message, Guild, TextChannel, RichEmbed, User, PartialTextBasedChannelFields } from 'discord.js';
import { ModuleServiceIdentifiers, ModuleConfigurationService, MessageService } from 'modules/message-link-embed-module/services';

export default class LinkQuoteHandler implements EventHandler {
    event: string = 'message';

    @lazyInject(ServiceIdentifiers.Client)
    clientService: ClientService;

    @lazyInject(ModuleServiceIdentifiers.Configuration)
    moduleConfigurationService: ModuleConfigurationService;

    @lazyInject(ModuleServiceIdentifiers.Message)
    messageService: MessageService;

    async handler(message: Message): Promise<void> {
        if(message.author.bot) {
            return;
        }

        const me: User = this.clientService.client.user;
        const linkMatches: RegExpMatchArray = message.content.match(/^https:\/\/discordapp.com\/channels\/(.+)\/(\d+)\/(\d+)\/?$/);

        if(!linkMatches) {
            return;
        }

        const guildId: string = linkMatches[1];
        const channelId: string = linkMatches[2];
        const messageId: string = linkMatches[3];
        const replyTargetChannel: PartialTextBasedChannelFields = this.moduleConfigurationService.sendLinkingErrorsToDMs ? message.author : message.channel;

        let channel: TextChannel;

        if (guildId === '@me') {
            channel = this.clientService.client.channels.find((channel) => channel.id === channelId) as TextChannel;
            if(!channel) {
                await this.messageService.sendDMInaccessibleMessage(replyTargetChannel);
                return;
            }
        }
        else {
            const guild: Guild = this.clientService.client.guilds.get(guildId);
            if(!guild) {
                await this.messageService.sendGuildInaccessibleMessage(replyTargetChannel);
                return;
            }
            channel = guild.channels.get(channelId) as TextChannel;
            if(!(channel && channel.permissionsFor(me).has(['READ_MESSAGES', 'READ_MESSAGE_HISTORY']))) {
                await this.messageService.sendChannelInaccessibleMessage(replyTargetChannel);
                return;
            }
        }

        const originMessage: Message = await channel.fetchMessage(messageId);
        if(!originMessage) {
            await this.messageService.sendMessageNotFoundMessage(replyTargetChannel);
            return;
        }

        //TODO: linking preferences

        const embed: RichEmbed = await this.messageService.getMessageLinkEmbed(message, originMessage);

        const resultMessages: Message | Message[] = await message.channel.send(originMessage.url, embed);

        if(resultMessages && message.deletable) {
            await message.delete();
        }
    }
}