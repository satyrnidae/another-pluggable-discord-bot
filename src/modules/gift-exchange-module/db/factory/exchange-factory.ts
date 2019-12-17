import { injectable, inject } from 'inversify';
import { DataEntityFactory } from 'api/db';
import { Exchange, GuildInstance } from 'modules/gift-exchange-module/db/entity';
import { Guild } from 'discord.js';
import { ServiceIdentifiers, DataService } from 'api/services';
import { Repository } from 'typeorm';
import { GuildInstanceFactory } from 'modules/gift-exchange-module/db/factory';

@injectable()
export class ExchangeFactory implements DataEntityFactory<Exchange> {

    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService,
        @inject(GuildInstanceFactory) private readonly guildInstanceFactory: GuildInstanceFactory) {}

    async load(guild: Guild, name: string, save = false): Promise<Exchange> {
        if(!name || !guild) {
            return null;
        }

        let exchange: Exchange;
        const guildInstance: GuildInstance = await this.guildInstanceFactory.load(guild);

        if(guildInstance.id) {
            const repository: Repository<Exchange> = await this.dataService.getRepository(Exchange);
            exchange = await repository.findOne({name, guild: {id: guildInstance.id}});
        }
        if(!exchange) {
            exchange = new Exchange();
            exchange.closed = false;
            exchange.guild = guildInstance;
            exchange.name = name;
            if (save) {
                await exchange.save();
            }
        }

        return exchange;
    }

}