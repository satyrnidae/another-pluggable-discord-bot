import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Repository, ManyToMany, Unique, JoinTable } from 'typeorm';
import { DataEntity } from '/src/api/db';
import { ServiceIdentifiers, DataService } from '/src/api/services';
import { lazyInject } from '/src/api/inversion';
import { GuildInstance } from '/src/modules/gift-exchange-module/db/entity/guild-instance';
import { ExchangeMember } from '/src/modules/gift-exchange-module/db/entity/exchange-member';

@Entity('gex/exchange')
@Unique('gex/name_to_guild', ['name', 'guild'])
export class Exchange extends DataEntity {

    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService: DataService;

    async save(): Promise<this & Exchange> {
        const repository: Repository<Exchange> = await this.dataService.getRepository(Exchange);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    closed: boolean;

    @ManyToOne(() => GuildInstance, guild => guild.exchanges, {cascade: ['insert']})
    guild: GuildInstance;

    @ManyToMany(() => ExchangeMember, member => member.exchanges)
    @JoinTable({
        name: 'gex/exchange_member_settings',
        joinColumn: {
            name: 'exchange_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'member_id',
            referencedColumnName: 'id'
        }
    })
    members: ExchangeMember[];
}
