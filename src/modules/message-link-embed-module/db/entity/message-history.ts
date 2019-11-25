import { DataEntity } from 'api/db';
import { lazyInject } from 'api/inversion';
import { ServiceIdentifiers, DataService } from 'api/services';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ChannelHistory, UserHistory } from 'modules/message-link-embed-module/db/entity';

@Entity('MsgLinkEmbed_MessageHistory')
export class MessageHistory implements DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService!: DataService;

    async save(): Promise<this & MessageHistory> {
        const repository = await this.dataService.getRepository(MessageHistory);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    nativeId: string;

    @ManyToOne(() => ChannelHistory, channel => channel.messages, {cascade: true})
    channel: ChannelHistory;

    @ManyToOne(() => UserHistory, user => user.messages, {cascade: true})
    user: UserHistory;
}