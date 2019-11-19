import { GuildConfiguration } from 'db';
import { DataEntityFactory, lazyInject, ServiceIdentifiers, DataService, ConfigurationService } from 'api';
import { Guild } from 'discord.js';
import { Repository } from 'typeorm';

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
            guildConfiguration.commandPrefix = this.configurationService.defaultPrefix;
            guildConfiguration.welcomeMsgSent = false;
            guildConfiguration.nativeId = guild.id;
        }

        return guildConfiguration;
    }

}