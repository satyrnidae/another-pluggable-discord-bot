import * as i18n from 'i18n';
import { inject, injectable } from 'inversify';
import {
    RichEmbed, Message, ColorResolvable, GuildMember, MessageAttachment, GroupDMChannel, PartialTextBasedChannelFields, DMChannel, MessageEmbed
} from 'discord.js';
import { ServiceIdentifiers, ClientService, ConfigurationService } from '/src/api/services';
import { ModuleServiceIdentifiers } from '/src/modules/message-link-embed-module/services/module-service-identifiers';
import { ModuleConfigurationService } from '/src/modules/message-link-embed-module/services/module-configuration-service';
import { WebRequestService } from '/src/modules/message-link-embed-module/services/web-request-service';
import { unionToArray, forEachAsync } from '/src/api/utils';

@injectable()
export class MessageService {

    constructor(
        @inject(ServiceIdentifiers.Client) private readonly clientService: ClientService,
        @inject(ServiceIdentifiers.Configuration) private readonly configurationService: ConfigurationService,
        @inject(ModuleServiceIdentifiers.Configuration) private readonly moduleConfigurationService: ModuleConfigurationService,
        @inject(ModuleServiceIdentifiers.WebRequest) private readonly webRequestService: WebRequestService) { }

    async sendDMInaccessibleMessage(channel: PartialTextBasedChannelFields): Promise<void> {
        await this.sendMessage(channel,
            i18n.__('%s Unfortunately, I\'m not able to access that direct message!', await this.moduleConfigurationService.getRandomGreeting()),
            i18n.__('Please note that only direct DMs with me are linkable, and users will be unable to follow the link.'),
            i18n.__('%s %s', await this.moduleConfigurationService.getRandomGratitude(), await this.configurationService.getRandomHeart()));
    }

    async sendGuildInaccessibleMessage(channel: PartialTextBasedChannelFields): Promise<void> {
        await this.sendMessage(channel,
            i18n.__('%s Unfortunately, I can\'t access the guild you have linked!', await this.moduleConfigurationService.getRandomGreeting()),
            i18n.__('If you want me to embed future messages, and you have access to add or remove bots in that guild, you can add me from the link:'),
            `<https://discordapp.com/api/oauth2/authorize?client_id=${this.clientService.user.id}&permissions=67495936&scope=bot>`,
            i18n.__('%s %s', await this.moduleConfigurationService.getRandomGratitude(), await this.configurationService.getRandomHeart()));
    }

    async sendChannelInaccessibleMessage(channel: PartialTextBasedChannelFields): Promise<void> {
        await this.sendMessage(channel,
            i18n.__('%s Unfortunately, I can\'t read the messages in the linked channel.', await this.moduleConfigurationService.getRandomGreeting()),
            i18n.__('If you\'d like me to be able to link messages in the future, could you ask an admin to add ')
                .concat(i18n.__('the "Read Messages" and "Read Message History" permissions to my role in that channel?')),
            i18n.__('Note that users who attempt to follow the link also need these permissions in the target channel!'),
            i18n.__('%s %s', await this.moduleConfigurationService.getRandomGratitude(), await this.configurationService.getRandomHeart()));
    }

    async sendMessageNotFoundMessage(channel: PartialTextBasedChannelFields): Promise<void> {
        await this.sendMessage(channel,
            i18n.__('%s I\'d love to embed that linked message, but I couldn\'t find it!', await this.moduleConfigurationService.getRandomGreeting()),
            i18n.__('Could you do me a solid and double check that the link is valid?'),
            i18n.__('%s %s', await this.moduleConfigurationService.getRandomGratitude(), await this.configurationService.getRandomHeart()));
    }

    async sendLinkedMessage(requestMessage: Message, originalMessage: Message): Promise<Message[]> {
        const embed: RichEmbed = await this.getMessageLinkEmbed(requestMessage, originalMessage);
        const sentMessages: Message[] = unionToArray(await requestMessage.channel.send(originalMessage.url, embed));
        sentMessages.push(...await this.resendMessageEmbeds(requestMessage.channel, originalMessage));
        return sentMessages;
    }

    private async resendMessageEmbeds(channel: PartialTextBasedChannelFields, originalMessage: Message): Promise<Message[]> {
        const sentMessages: Message[] = [];
        await forEachAsync(originalMessage.embeds, async (current: MessageEmbed) => {
            const newEmbed: RichEmbed = new RichEmbed(current);
            sentMessages.push(...unionToArray(await channel.send(newEmbed)));
        });
        return sentMessages;
    }

    private async getMessageLinkEmbed(requestMessage: Message, originMessage: Message): Promise<RichEmbed> {
        const embed: RichEmbed = new RichEmbed()
            .setColor(this.getEmbedColor(requestMessage, originMessage))
            .setAuthor(this.getSenderUserName(requestMessage, originMessage), originMessage.author.displayAvatarURL, originMessage.url)
            .setThumbnail(this.getEmbedThumbnailURL(originMessage))
            .setDescription(originMessage.content)
            .setURL(originMessage.url)
            .setFooter(i18n.__('Requested by %s', this.getRequestorUserName(requestMessage)).concat('\r\n')
                .concat(i18n.__('from %s', this.getOriginGuildName(originMessage))), requestMessage.author.avatarURL)
            .setTimestamp(originMessage.createdAt);

        return this.addAttachments(embed, originMessage);
    }

    private async sendMessage(channel: PartialTextBasedChannelFields, ...messageLines: string[]): Promise<void> {
        let message = '';
        messageLines.forEach((line, index) => {
            if (index) {
                message = message.concat('\r\n');
            }
            message = message.concat(line);
        });
        if (message) {
            await channel.send(message);
        }
    }

    private getOriginGuildName(originMessage: Message) {
        if (originMessage.guild) {
            return originMessage.guild.name;
        }
        if (originMessage.channel.type === 'group') {
            const groupDMChannel: GroupDMChannel = originMessage.channel as GroupDMChannel;
            return groupDMChannel.name;
        }
        if (originMessage.channel.type === 'dm') {
            const dmChannel: DMChannel = originMessage.channel as DMChannel;
            return i18n.__('a DM between %s and %s', this.clientService.getDisplayName(), dmChannel.recipient.username);
        }
        return i18n.__('an unknown location');
    }

    private getRequestorUserName(requestMessage: Message) {
        if (requestMessage.guild) {
            const requestor: GuildMember = requestMessage.guild.member(requestMessage.author);
            if (requestor) {
                return requestor.displayName;
            }
        }
        return requestMessage.author.username;
    }

    private getSenderUserName(requestMessage: Message, originMessage: Message): string {
        if (requestMessage.guild) {
            const activeUser: GuildMember = requestMessage.guild.member(originMessage.author);
            if (activeUser) {
                return activeUser.displayName;
            }
        }

        return originMessage.author.username;
    }

    private getEmbedThumbnailURL(originMessage: Message): string {
        if (originMessage.guild) {
            return originMessage.guild.iconURL;
        }
        if (originMessage.channel.type === 'group') {
            const groupDMChannel: GroupDMChannel = originMessage.channel as GroupDMChannel;
            return groupDMChannel.icon || originMessage.author.displayAvatarURL;
        }
        return originMessage.author.displayAvatarURL;
    }

    private getEmbedColor(requestMessage: Message, originMessage: Message): ColorResolvable {
        let senderInCurrentGuild: GuildMember = null;
        let senderInOriginGuild: GuildMember = null;
        if (requestMessage.guild) {
            senderInCurrentGuild = requestMessage.guild.member(originMessage.author);
        }
        if (originMessage.guild) {
            senderInOriginGuild = originMessage.guild.member(originMessage.author);
        }

        if (!senderInCurrentGuild) {
            if (senderInOriginGuild && senderInOriginGuild.colorRole) {
                return senderInOriginGuild.displayColor;
            }
        }
        else if (senderInCurrentGuild.colorRole) {
            return senderInCurrentGuild.displayColor;
        }

        return originMessage.author.bot ? '#7289da' : '#99aab5';
    }

    private async addAttachments(embed: RichEmbed, originMessage: Message): Promise<RichEmbed> {
        if (originMessage.attachments && originMessage.attachments.size) {
            let attachmentsFieldValue = '';
            await forEachAsync(originMessage.attachments.array(), async (attachment: MessageAttachment): Promise<void> => {
                if (!embed.image) {
                    const contentType = await this.webRequestService.getContentType(attachment.url);
                    if (contentType.startsWith('image') && !embed.image) {
                        embed.setImage(attachment.url);
                    }
                }
                attachmentsFieldValue = attachmentsFieldValue.concat(attachment.url).concat('\r\n');
            });

            if (attachmentsFieldValue) {
                embed.addField(i18n.__('Attachments'), attachmentsFieldValue);
            }
        }

        return embed;
    }
}
