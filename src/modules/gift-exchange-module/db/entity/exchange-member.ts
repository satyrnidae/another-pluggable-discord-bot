import { DataEntity } from "api/db";
import { lazyInject } from "api/inversion";
import { ServiceIdentifiers, DataService } from "api/services";
import { PrimaryGeneratedColumn, Entity, Column, ManyToMany, JoinColumn, Repository, OneToMany } from "typeorm";
import { Exchange, ExchangePreferences } from "modules/gift-exchange-module/db/entity";

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

    @Column({nullable: true})
    deliveryAddress: string;

    @OneToMany(() => ExchangePreferences, preferences => preferences.member, {cascade: ['remove']})
    preferences: ExchangePreferences[];

    @ManyToMany(() => Exchange, exchange => exchange.members)
    @JoinColumn({name: 'gex/ExchangeToMember'})
    exchanges: Exchange[];
}