import { DataEntity } from "api/db";
import { lazyInject } from "api/inversion";
import { ServiceIdentifiers, DataService } from "api/services";
import { PrimaryGeneratedColumn, Entity, Column, ManyToMany, JoinColumn, Repository } from "typeorm";
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
    id: Number;

    @Column()
    nativeId: string;

    @ManyToMany(() => Exchange, exchange => exchange.members)
    @JoinColumn({name: 'gex/ExchangeToMember'})
    exchanges: Exchange[];
}