import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { DataEntity } from 'api';
import { UserLinkingPreferences } from 'modules/message-link-embed-module/db/entity';

@Entity()
export default class LinkedMessageDetails extends DataEntity {
    save(): Promise<this & LinkedMessageDetails> {
        throw new Error('Method not implemented.');
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    originGuildId: string;

    @Column()
    originChannelId: string;

    @Column()
    originMessageId: string;

    @Column()
    targetGuildId: string;

    @Column()
    targetChannelId: string;

    @Column()
    targetMessageId: string;

    @Column()
    requestor: string;

    @OneToOne(type => UserLinkingPreferences)
    @JoinColumn()
    senderPreferences: UserLinkingPreferences;
}
