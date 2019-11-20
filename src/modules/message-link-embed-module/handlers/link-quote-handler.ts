import i18n = require('i18n');
import { EventHandler, lazyInject, ServiceIdentifiers, ClientService, ConfigurationService } from 'api';
import { Message, Guild, GuildMember, TextChannel, RichEmbed, ColorResolvable, Role, User } from 'discord.js';
import { UserLinkingPreferences } from 'modules/message-link-embed-module/db/entity';
import { UserLinkingPreferencesFactory } from 'modules/message-link-embed-module/db/factory';

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
        const linkedMessage: Message = await channel.fetchMessage(messageId);
        if(!linkedMessage) {
            await message.author.send(i18n.__('%s I\'d love to embed that linked message, but I couldn\'t find it!', this.getRandomGreeting()).concat('\r\n')
                .concat(i18n.__('Could you do me a solid and double check that the link is valid?')).concat('\r\n')
                .concat(i18n.__('%s %s', this.getRandomThanks(), this.getRandomHeart())));
            return;
        }

        const userPreferences: UserLinkingPreferences = await new UserLinkingPreferencesFactory().load(linkedMessage.author);
        await userPreferences.save();
//TODO: linking preferences
        let senderUserName: string = linkedMessage.author.username;

        const linkedUser: GuildMember = message.guild.member(linkedMessage.author);
        const activeUser: GuildMember = guild.member(linkedMessage.author);

        let color: ColorResolvable = message.author.bot ? '#7289da' : '#99aab5';

        if(!linkedUser) {
            if(activeUser) {
                color = activeUser.displayColor;
            }
        }
        else {
            color = linkedUser.displayColor;
        }
        if(activeUser) {
            senderUserName = activeUser.displayName;
        }

        const embed: RichEmbed = new RichEmbed()
            .setColor(color)
            .setAuthor(senderUserName, linkedMessage.author.displayAvatarURL, linkedMessage.url)
            .setThumbnail(guild.iconURL)
            .setDescription(linkedMessage.content)
            .setURL(linkedMessage.url)
            .setFooter(i18n.__('Requested by %s', requestorName).concat('\r\n')
                .concat(i18n.__('from %s', linkedMessage.guild.name)), message.author.avatarURL)
            .setTimestamp(linkedMessage.createdAt);

        await message.channel.send(linkedMessage.url, embed);



        //await linkedMessage.author.send(i18n.__('%s Heads up, your message in the "%s" guild was linked in the "%s" guild by the user %s.',
        //    this.getRandomGreeting(), linkedMessage.guild.name, message.guild.name, message.author.username).concat('\r\n')
        //    .concat(i18n.__('[disable functionality coming soon!]')).concat('\r\n')
        //    .concat(i18n.__('%s %s', this.getRandomThanks(), this.getRandomHeart())), embed);

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
}