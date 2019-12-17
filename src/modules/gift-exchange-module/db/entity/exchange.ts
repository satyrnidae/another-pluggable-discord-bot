import { DataEntity } from "api/db";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Repository, JoinColumn, ManyToMany, Unique, JoinTable } from "typeorm";
import { lazyInject } from "api/inversion";
import { ServiceIdentifiers, DataService } from "api/services";
import { GuildInstance, ExchangeMember } from "modules/gift-exchange-module/db/entity";

@Entity('gex/Exchange')
@Unique('gex/nametoguild', ['name', 'guild'])
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
        name: 'gex/ExchangeMemberSettings',
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
