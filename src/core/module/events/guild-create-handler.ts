import { Guild } from 'discord.js';
import { ServiceIdentifiers, ConfigurationService } from '/src/api/services';
import { EventHandler } from '/src/api/module';
import { lazyInject } from '/src/api/inversion';
import { CoreModuleServiceIdentifiers, MessageService } from '/src/core/module/services';

export class GuildCreateHandler extends EventHandler {
    readonly event = 'guildCreate';

    @lazyInject(ServiceIdentifiers.Configuration)
    private readonly configurationService: ConfigurationService;

    @lazyInject(CoreModuleServiceIdentifiers.Message)
    private readonly messageService: MessageService;

    async handler(guild: Guild): Promise<void> {
        const defaultNickname: string = await this.configurationService.getDefaultNickname();

        if (defaultNickname) {
            guild.me.setNickname(defaultNickname);
        }

        await this.messageService.sendGuildWelcomeMessage(guild);
    }
}
