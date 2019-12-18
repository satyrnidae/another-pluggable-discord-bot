import { injectable, inject } from 'inversify';
import { Guild } from 'discord.js';
import { Repository } from 'typeorm';
import { DataEntityFactory } from '/src/api/db';
import { ServiceIdentifiers, DataService } from '/src/api/services';
import { Exchange } from '/src/modules/gift-exchange-module/db/entity';
import { GuildInstanceFactory } from '/src/modules/gift-exchange-module/db/factory/guild-instance-factory';

@injectable()
export class ExchangeFactory implements DataEntityFactory<Exchange> {

    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService,
        @inject(GuildInstanceFactory) private readonly guildInstanceFactory: GuildInstanceFactory) { }

    async load(guild: Guild, name: string, save = false): Promise<Exchange> {
        if (!name || !guild) {
            return null;
        }
        const repository: Repository<Exchange> = await this.dataService.getRepository(Exchange);
        let exchange = await repository.findOne({
            name,
            guild: {
                nativeId: guild.id
            }
        });
        if (!exchange) {
            exchange = new Exchange();
            exchange.closed = false;
            exchange.guild = await this.guildInstanceFactory.load(guild);
            exchange.name = name;
            if (save) {
                await exchange.save();
            }
        }

        return exchange;
    }

}