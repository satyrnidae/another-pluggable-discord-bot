import { DataEntityFactory } from 'api/db';
import { GuildInstance } from 'modules/gift-exchange-module/db/entity';
import { Guild } from 'discord.js';
import { injectable, inject } from 'inversify';
import { ServiceIdentifiers, DataService } from 'api/services';
import { Repository } from 'typeorm';

@injectable()
export class GuildInstanceFactory implements DataEntityFactory<GuildInstance> {

    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService) { }

    async load(guild: Guild, save: boolean = false): Promise<GuildInstance> {
        if (guild === null) return;
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