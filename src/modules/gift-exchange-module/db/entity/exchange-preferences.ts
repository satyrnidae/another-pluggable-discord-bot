import { DataEntity } from "api/db";
import { lazyInject } from "api/inversion";
import { ServiceIdentifiers, DataService } from "api/services";
import { Repository, PrimaryGeneratedColumn, ManyToOne, Column, Entity } from "typeorm";
import { Exchange, ExchangeMember } from 'modules/gift-exchange-module/db/entity';

export enum DeliveryMethod {
    Unspecified = 'Unspecified',
    InPerson = 'In-Person',
    Mail = 'By Mail'
}

@Entity('gex/ExchangePreferences')
export class ExchangePreferences extends DataEntity {

    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService: DataService;

    async save(): Promise<this & ExchangePreferences> {
        const repository: Repository<ExchangePreferences> = await this.dataService.getRepository(ExchangePreferences);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExchangeMember, member => member.preferences, {cascade: ['insert']})
    member: ExchangeMember;

    @ManyToOne(() => Exchange, {cascade: ['insert']})
    exchange: Exchange;

    @Column({nullable: true})
    preferredGift: string;

    @Column()
    discloseAddress: boolean;

    @Column({
        type: 'enum',
        enum: DeliveryMethod,
        default: DeliveryMethod.Unspecified
    })
    deliveryMethod: DeliveryMethod;
}