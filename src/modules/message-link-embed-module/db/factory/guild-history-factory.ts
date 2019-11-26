import { DataEntityFactory } from 'api/db';
import { Guild } from 'discord.js';
import { inject, injectable } from 'inversify';
import { ServiceIdentifiers, DataService } from 'api/services';
import { GuildHistory } from 'modules/message-link-embed-module/db/entity';

@injectable()
export class GuildHistoryFactory implements DataEntityFactory<GuildHistory> {
    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService) {}

    async load(guild?: Guild): Promise<GuildHistory> {
        const nativeId = guild ? guild.id : '@me';
        const repository = await this.dataService.getRepository(GuildHistory);
        let object = await repository.findOne({nativeId});
        if(!object) {
            object = new GuildHistory();
            object.nativeId = nativeId;
        }
        const name: string = guild ? guild.name : '@me';
        object.name = name;
        return object;
    }

}