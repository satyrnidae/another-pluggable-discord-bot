import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, Repository, ManyToOne } from 'typeorm';
import { DataEntity, lazyInject, ServiceIdentifiers, DataService } from 'api';
import { UserLinkingPreferences } from '.';

@Entity()
export default class LinkedMessageDetails extends DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    dataService: DataService;

    async save(): Promise<this & LinkedMessageDetails> {
        const repository: Repository<LinkedMessageDetails> = await this.dataService.getRepository(LinkedMessageDetails);
        return repository.save(this);
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
    requestorId: string;

    @Column()
    senderId: string;

    @ManyToOne(type => UserLinkingPreferences)
    @JoinColumn()
    senderPreferences: UserLinkingPreferences;
}
