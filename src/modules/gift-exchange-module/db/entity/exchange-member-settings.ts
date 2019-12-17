import { DataEntity } from 'api/db';
import { Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Exchange } from 'modules/gift-exchange-module/db/entity/exchange';
import { ExchangeMember } from 'modules/gift-exchange-module/db/entity/exchange-member';

@Entity('gex/ExchangeMemberSettings')
export class ExchangeMemberSettings extends DataEntity {
    async save(): Promise<this & ExchangeMemberSettings> {
        throw new Error('Not Implemented');
    }

    @JoinColumn({name: 'exchange_id'})
    @ManyToOne(() => Exchange, { primary: true })
    exchange: Exchange;

    @JoinColumn({name: 'member_id'})
    @ManyToOne(() => ExchangeMember, { primary: true })
    member: ExchangeMember;

    @Column({nullable: true})
    discloseAddress: boolean;

    @Column({nullable: true})
    giftPreference: string;

    @Column({type: 'varchar', nullable: true, default: 'INPERSON'})
    deliveryPreference: 'INPERSON'|'MAIL';
}