import { Guild } from 'discord.js';
import { Repository } from 'typeorm';
import { DataEntityFactory } from 'api/db';
import { GuildConfiguration } from 'db/entity';
import { lazyInject } from 'api/inversion';
import { ServiceIdentifiers, DataService, ConfigurationService } from 'api/services';

export default class GuildConfigurationFactory extends DataEntityFactory<GuildConfiguration>{

    @lazyInject(ServiceIdentifiers.Data)
    dataService: DataService;

    @lazyInject(ServiceIdentifiers.Configuration)
    configurationService: ConfigurationService;

    async load(guild: Guild): Promise<GuildConfiguration> {
        if(!guild) {
            return null;
        }

        const guildRepository: Repository<GuildConfiguration> = await this.dataService.getRepository(GuildConfiguration);
        let guildConfiguration: GuildConfiguration = await guildRepository.findOne({nativeId: guild.id});

        if(!guildConfiguration) {
            guildConfiguration = new GuildConfiguration();
            guildConfiguration.commandPrefix = await this.configurationService.getDefaultPrefix();
            guildConfiguration.welcomeMsgSent = false;
            guildConfiguration.nativeId = guild.id;
            await guildConfiguration.save();
        }

        return guildConfiguration;
    }
}
