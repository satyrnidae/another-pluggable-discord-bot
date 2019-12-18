import { Repository, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { DataEntity } from '/src/api/db';
import { lazyInject } from '/src/api/inversion';
import { ServiceIdentifiers } from '/src/api/services';
import { DataService } from '/src/core/services';
import { Exchange } from '/src/modules/gift-exchange-module/db/entity/exchange';

@Entity('gex/guild_instance')
export class GuildInstance extends DataEntity {

    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService: DataService;

    async save(): Promise<this & GuildInstance> {
        const repository: Repository<GuildInstance> = await this.dataService.getRepository(GuildInstance);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    nativeId: string;

    @OneToMany(() => Exchange, exchange => exchange.guild, {cascade: ['remove']})
    exchanges: Exchange[];
}
