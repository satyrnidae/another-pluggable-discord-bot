import { EventHandler, lazyInject, ServiceIdentifiers, ConfigurationService } from 'api';
import { Guild } from 'discord.js';
import { MessageService, CoreModuleServiceIdentifiers } from 'core';

export default class GuildCreateHandler extends EventHandler {
    event: string = 'guildCreate';

    @lazyInject(ServiceIdentifiers.Configuration)
    configurationService: ConfigurationService;

    @lazyInject(CoreModuleServiceIdentifiers.Message)
    messageService: MessageService;

    async handler(guild: Guild): Promise<any> {
        if (this.configurationService.defaultNickname) {
            guild.me.setNickname(this.configurationService.defaultNickname);
        }

        return this.messageService.sendGuildWelcomeMessage(guild);
    }
}
