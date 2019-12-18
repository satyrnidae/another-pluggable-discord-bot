import { Entity, ManyToOne, JoinColumn, Column, Repository } from 'typeorm';
import { DataEntity } from '/src/api/db';
import { Exchange, ExchangeMember } from '/src/modules/gift-exchange-module/db/entity';
import { lazyInject } from '/src/api/inversion';
import { ServiceIdentifiers, DataService } from '/src/api/services';

type DeliveryPreference = 'INPERSON'|'MAIL';

@Entity('gex/exchange_member_settings')
export class ExchangeMemberSettings extends DataEntity {

    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService: DataService;

    async save(): Promise<this & ExchangeMemberSettings> {
        const repository: Repository<ExchangeMemberSettings> = await this.dataService.getRepository(ExchangeMemberSettings);
        return repository.save(this);
    }

    @JoinColumn({name: 'exchange_id'})
    @ManyToOne(() => Exchange, { primary: true, cascade: ['insert'] })
    exchange: Exchange;

    @JoinColumn({name: 'member_id'})
    @ManyToOne(() => ExchangeMember, { primary: true, cascade: ['insert'] })
    member: ExchangeMember;

    @Column({nullable: true})
    discloseAddress: boolean;

    @Column({nullable: true})
    giftPreference: string;

    @Column({type: 'varchar', nullable: true, default: 'INPERSON'})
    deliveryPreference: DeliveryPreference;
}