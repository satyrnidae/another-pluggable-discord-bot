import { PrimaryGeneratedColumn, Entity, Column, ManyToMany, Repository, JoinTable } from 'typeorm';
import { DataEntity } from '/src/api/db';
import { ServiceIdentifiers, DataService } from '/src/api/services';
import { lazyInject } from '/src/api/inversion';
import { Exchange } from '/src/modules/gift-exchange-module/db/entity/exchange';

@Entity('gex/exchange_member')
export class ExchangeMember extends DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService: DataService;

    async save(): Promise<this & ExchangeMember> {
        const repository: Repository<ExchangeMember> = await this.dataService.getRepository(ExchangeMember);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    nativeId: string;

    @ManyToMany(() => Exchange, exchange => exchange.members)
    @JoinTable({
        name: 'gex/exchange_member_settings',
        joinColumn: {
            name: 'member_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'exchange_id',
            referencedColumnName: 'id'
        }
    })
    exchanges: Exchange[];

    @Column({nullable: true})
    address: string;
}