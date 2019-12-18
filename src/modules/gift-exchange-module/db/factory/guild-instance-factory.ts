import { Guild } from 'discord.js';
import { injectable, inject } from 'inversify';
import { Repository } from 'typeorm';
import { DataEntityFactory } from '/src/api/db';
import { GuildInstance } from '/src/modules/gift-exchange-module/db/entity';
import { ServiceIdentifiers, DataService } from '/src/api/services';

@injectable()
export class GuildInstanceFactory implements DataEntityFactory<GuildInstance> {

    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService) { }

    async load(guild: Guild, save = false): Promise<GuildInstance> {
        if (guild === null) {
            return null;
        }

        const nativeId: string = guild.id;
        const repository: Repository<GuildInstance> = await this.dataService.getRepository(GuildInstance);
        let guildInstance: GuildInstance = await repository.findOne({nativeId});
        if (!guildInstance) {
            guildInstance = new GuildInstance();
            guildInstance.nativeId = nativeId;
            if (save) {
                await guildInstance.save();
            }
        }
        return guildInstance;
    }
}