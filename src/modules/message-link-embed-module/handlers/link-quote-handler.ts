import i18n = require('i18n');
import { XMLHttpRequest } from 'xmlhttprequest';
import { EventHandler, lazyInject, ServiceIdentifiers, ClientService, ConfigurationService, forEachAsync } from 'api';
import { Message, Guild, GuildMember, TextChannel, RichEmbed, ColorResolvable, Role, User, MessageEmbed, MessageAttachment, Attachment } from 'discord.js';
import { UserLinkingPreferences } from 'modules/message-link-embed-module/db/entity';
import { UserLinkingPreferencesFactory, LinkedMessageDetailsFactory } from 'modules/message-link-embed-module/db/factory';

export default class LinkQuoteHandler implements EventHandler {
    event: string = 'message';

    @lazyInject(ServiceIdentifiers.Client)
    clientService: ClientService;

    @lazyInject(ServiceIdentifiers.Configuration)
    configurationService: ConfigurationService;

    async handler(message: Message): Promise<void> {
        if(message.author.bot || !message.guild) {
            return;
        }
        const me: User = this.clientService.client.user;

        const linkMatches: RegExpMatchArray = message.content.match(/^https:\/\/discordapp.com\/channels\/(.+)\/(\d+)\/(\d+)\/?$/);

        if(!linkMatches) {
            return;
        }

        let requestorName: string = message.author.username;
        const requestor: GuildMember = message.guild.member(message.author);
        if(requestor) {
            requestorName = requestor.displayName;
        }

        const guildId: string = linkMatches[1];
        const channelId: string = linkMatches[2];
        const messageId: string = linkMatches[3];

        if (guildId === '@me') {
            await message.author.send(i18n.__('%s Unfortunately, I\'m not about to share your direct messages with the world!', this.getRandomGreeting()).concat('\r\n')
                .concat(i18n.__('Feel free to copy the link from any public message in a guild I can access.')).concat('\r\n')
                .concat(i18n.__('%s %s', this.getRandomThanks(), this.getRandomHeart())));
            return;
        }
        const guild: Guild = this.clientService.client.guilds.get(guildId);
        if(!guild) {
            await message.author.send(i18n.__('%s Unfortunately, I can\'t access the guild you have linked!', this.getRandomGreeting()).concat('\r\n')
                .concat(i18n.__('If you want me to embed future messages, and you have access to add or remove bots in that guild, you can add me from the link:'))
                .concat('\r\n')
                .concat(i18n.__('<https://discordapp.com/api/oauth2/authorize?client_id=%s&permissions=%s&scope=bot>', this.clientService.userId, '67495936').concat('\r\n')
                .concat(i18n.__('%s %s', this.getRandomThanks(), this.getRandomHeart()))));
            return;
        }
        const channel: TextChannel = guild.channels.get(channelId) as TextChannel;
        if(!(channel && channel.permissionsFor(me).has(['READ_MESSAGES', 'READ_MESSAGE_HISTORY']))) {
            await message.author.send(i18n.__('%s Unfortunately, I can\'t read the messages in the linked channel.', this.getRandomGreeting()).concat('\r\n')
                .concat(i18n.__('If you\'d like me to be able to link messages in the future, could you ask an admin to add '))
                .concat(i18n.__('the "Read Messages" and "Read Message History" permissions to my role in that channel?')).concat('\r\n')
                .concat(i18n.__('%s %s', this.getRandomThanks(), this.getRandomHeart())));
            return;
        }
        const originMessage: Message = await channel.fetchMessage(messageId);
        if(!originMessage) {
            await message.author.send(i18n.__('%s I\'d love to embed that linked message, but I couldn\'t find it!', this.getRandomGreeting()).concat('\r\n')
                .concat(i18n.__('Could you do me a solid and double check that the link is valid?')).concat('\r\n')
                .concat(i18n.__('%s %s', this.getRandomThanks(), this.getRandomHeart())));
            return;
        }

        const originUserInGuild: GuildMember = message.guild.member(originMessage.author);
        const originUserInOriginGuild: GuildMember = guild.member(originMessage.author);

        const userPreferences: UserLinkingPreferences = await new UserLinkingPreferencesFactory().load(originMessage.author.id);
        if(!userPreferences.linkingEnabled) {
            await message.author.send(i18n.__('%s The user who sent that message have disabled linking their messages.', this.getRandomGreeting()).concat('\r\n')
                .concat(i18n.__('%s %s', this.getRandomGreeting(), this.getRandomHeart())));
            return;
        }
        if(!userPreferences.linkFromInactiveGuilds && !originUserInOriginGuild) {
            await message.author.send(i18n.__('%s The user who sent that message has disabled linking from guilds they are no longer active in.', this.getRandomGreeting()).concat('\r\n')
                .concat(i18n.__('%s %s', this.getRandomGreeting(), this.getRandomHeart())));
            return;
        }
        if(!userPreferences.linkToExternalGuilds && !originUserInGuild) {
            await message.author.send(i18n.__('%s The user who sent that message has disabled linking to guilds they are not currently active in.', this.getRandomGreeting()).concat('\r\n')
                .concat(i18n.__('%s %s', this.getRandomGreeting(), this.getRandomHeart())));
            return;
        }

        let senderUserName: string = originMessage.author.username;
        let color: ColorResolvable = originMessage.author.bot ? '#7289da' : '#99aab5';

        if(!originUserInGuild) {
            if(originUserInOriginGuild && originUserInOriginGuild.colorRole) {
                color = originUserInOriginGuild.displayColor;
            }
        }
        else if(originUserInGuild.colorRole) {
            color = originUserInGuild.displayColor;
        }
        if(originUserInOriginGuild) {
            senderUserName = originUserInOriginGuild.displayName;
        }

        const embed: RichEmbed = new RichEmbed()
            .setColor(color)
            .setAuthor(senderUserName, originMessage.author.displayAvatarURL, originMessage.url)
            .setThumbnail(guild.iconURL)
            .setDescription(originMessage.content)
            .setURL(originMessage.url)
            .setFooter(i18n.__('Requested by %s', requestorName).concat('\r\n')
                .concat(i18n.__('from %s', originMessage.guild.name)), message.author.avatarURL)
            .setTimestamp(originMessage.createdAt);

        if(originMessage.attachments && originMessage.attachments.size) {
            let attachmentsFieldValue: string = '';
            originMessage.attachments.forEach(attachment => {
                const url: string = attachment.url;
                if(!embed.image) {
                    const xhttp: XMLHttpRequest = new XMLHttpRequest();
                    xhttp.timeout = this.CONTENT_TYPE_REQUEST_TIMEOUT;
                    xhttp.open('HEAD', url, false);
                    xhttp.send();
                    if(xhttp.status === this.SUCCESS && xhttp.getResponseHeader('Content-Type').startsWith('image')) {
                        embed.setImage(url);
                    }
                }
                if(attachmentsFieldValue) {
                    attachmentsFieldValue = attachmentsFieldValue.concat('\r\n');
                }
                attachmentsFieldValue = attachmentsFieldValue.concat(attachment.proxyURL);
            });
            if(attachmentsFieldValue) {
                embed.addField(i18n.__('Attachments'), attachmentsFieldValue);
            }
        }

        const sentMessages: Message[] = [];
        const linkMessage: Message | Message[] = await message.channel.send(originMessage.url, embed);
        if(linkMessage as Message) {
            sentMessages.push(linkMessage as Message);
        }
        else if(linkMessage as Message[]) {
            (linkMessage as Message[]).forEach(linkMessage => sentMessages.push(linkMessage));
        }
        await forEachAsync(originMessage.embeds, async (embed) => {
            const newEmbed: RichEmbed = new RichEmbed(embed);
            const linkMessage: Message | Message[] = await message.channel.send(newEmbed);
            if(linkMessage as Message) {
                sentMessages.push(linkMessage as Message);
            }
            else if(linkMessage as Message[]) {
                (linkMessage as Message[]).forEach(linkMessage => sentMessages.push(linkMessage));
            }
        });

        await forEachAsync(originMessage.attachments.array(), async (attachment: MessageAttachment) => {
            const newAttachment = new Attachment(attachment.url);
            const linkMessage: Message | Message[] = await message.channel.send(newAttachment);
            if(linkMessage as Message) {
                sentMessages.push(linkMessage as Message);
            }
            else if(linkMessage as Message[]) {
                (linkMessage as Message[]).forEach(linkMessage => sentMessages.push(linkMessage));
            }
        });

        await forEachAsync(sentMessages as Message[], async (replyMessage: Message) => {
            if(replyMessage === null) return;
            await new LinkedMessageDetailsFactory().load(originMessage, message, replyMessage);
        });

        if(message.deletable) {
            await message.delete();
        }
    }
    private getRandomHeart(): string {
        return `:${this.configurationService.hearts[Math.floor(Math.random() * this.configurationService.hearts.length)]}:`;
    }
    private getRandomGreeting(): string {
        return this.GREETINGS[Math.floor(Math.random() * this.GREETINGS.length)];
    }
    private getRandomThanks(): string {
        return this.THANKS[Math.floor(Math.random() * this.THANKS.length)];
    }
    readonly GREETINGS: string[] = [
        i18n.__('Hey there!'),
        i18n.__('Howdy!'),
        i18n.__('What\'s up?'),
        i18n.__('Hey, what\'s up?'),
        i18n.__('Hey!'),
        i18n.__('Hello!')
    ];

    readonly THANKS: string[] = [
        i18n.__('Thank you!'),
        i18n.__('Thanks aplenty!'),
        i18n.__('Thanks!'),
        i18n.__('Cheers!'),
        i18n.__('Thanks much!'),
        i18n.__('Thank you much!'),
        i18n.__('Thank you so much!'),
        i18n.__('It\'s greatly appreciated, thank you!')
    ];

    readonly CONTENT_TYPE_REQUEST_TIMEOUT: number = 500;
    readonly SUCCESS: number = 200;
}