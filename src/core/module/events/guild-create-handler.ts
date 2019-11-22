import { EventHandler, lazyInject, ServiceIdentifiers, ConfigurationService } from 'api';
import { Guild } from 'discord.js';
import { MessageService, CoreModuleServiceIdentifiers } from 'core/module/services';

export default class GuildCreateHandler extends EventHandler {
    event = 'guildCreate';

    @lazyInject(ServiceIdentifiers.Configuration)
    configurationService: ConfigurationService;

    @lazyInject(CoreModuleServiceIdentifiers.Message)
    messageService: MessageService;

    async handler(guild: Guild): Promise<any> {
        const defaultNickname: string = await this.configurationService.getDefaultNickname();

        if (defaultNickname) {
            guild.me.setNickname(defaultNickname);
        }

        return this.messageService.sendGuildWelcomeMessage(guild);
    }
}
