import { Guild } from 'discord.js';
import { Repository } from 'typeorm';
import { injectable, inject } from 'inversify';
import { ServiceIdentifiers, ConfigurationService, DataService } from '/src/api/services';
import { DataEntityFactory } from '/src/api/db';
import { GuildConfiguration } from '/src/db/entity';

@injectable()
export class GuildConfigurationFactory implements DataEntityFactory<GuildConfiguration> {
    /**
     * @param dataService The injected data service instance
     * @param configurationService The injected configuration service instance
     */
    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService,
        @inject(ServiceIdentifiers.Configuration) private readonly configurationService: ConfigurationService) { }

    /**
     * @param guild The Discord guild that this configuration is for
     * @param save Optionally, whether or not the instance should be saved if it is newly created. Defaults to false.
     */
    async load(guild: Guild, save = false): Promise<GuildConfiguration> {
        if (!guild) {
            return null;
        }
        const guildRepository: Repository<GuildConfiguration> = await this.dataService.getRepository(GuildConfiguration);
        let guildConfiguration: GuildConfiguration = await guildRepository.findOne({ nativeId: guild.id });

        if (!guildConfiguration) {
            guildConfiguration = new GuildConfiguration();
            guildConfiguration.commandPrefix = await this.configurationService.getDefaultPrefix();
            guildConfiguration.welcomeMsgSent = false;
            guildConfiguration.nativeId = guild.id;
            if (save) {
                await guildConfiguration.save();
            }
        }

        return guildConfiguration;
    }
}
