import { Guild } from 'discord.js';
import { inject, injectable } from 'inversify';
import { DataEntityFactory } from '/src/api/db';
import { ServiceIdentifiers, DataService } from '/src/api/services';
import { GuildHistory } from '/src/modules/message-link-embed-module/db/entity';

@injectable()
export class GuildHistoryFactory implements DataEntityFactory<GuildHistory> {
    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService) { }

    async load(guild?: Guild): Promise<GuildHistory> {
        const nativeId = guild ? guild.id : '@me';
        const repository = await this.dataService.getRepository(GuildHistory);
        let guildHistory = await repository.findOne({ nativeId });
        if (!guildHistory) {
            guildHistory = new GuildHistory();
            guildHistory.nativeId = nativeId;
        }
        const name: string = guild ? guild.name : '@me';
        guildHistory.name = name;
        return guildHistory;
    }
}
