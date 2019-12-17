import { DataEntity } from "api/db";
import { lazyInject } from "api/inversion";
import { ServiceIdentifiers, DataService } from "api/services";
import { PrimaryGeneratedColumn, Entity, Column, ManyToMany, JoinColumn, Repository, JoinTable } from "typeorm";
import { Exchange } from "modules/gift-exchange-module/db/entity";

@Entity('gex/ExchangeMember')
export class ExchangeMember extends DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService: DataService;

    async save(): Promise<this & ExchangeMember> {
        const repository: Repository<ExchangeMember> = await this.dataService.getRepository(ExchangeMember);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nativeId: string;

    @ManyToMany(() => Exchange, exchange => exchange.members)
    @JoinTable({
        name: 'gex/ExchangeMemberSettings',
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