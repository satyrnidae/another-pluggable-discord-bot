import { DataEntity } from "api/db";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Repository, JoinColumn, ManyToMany } from "typeorm";
import { lazyInject } from "api/inversion";
import { ServiceIdentifiers, DataService } from "api/services";
import { GuildInstance, ExchangeMember } from "modules/gift-exchange-module/db/entity";

@Entity('gex/Exchange')
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
    active: boolean;

    @ManyToOne(() => GuildInstance, guild => guild.exchanges, {cascade: ['insert']})
    guild: GuildInstance;

    @ManyToMany(() => ExchangeMember, member => member.exchanges)
    @JoinColumn({name: 'gex/ExchangeToMember'})
    members: ExchangeMember;
}
