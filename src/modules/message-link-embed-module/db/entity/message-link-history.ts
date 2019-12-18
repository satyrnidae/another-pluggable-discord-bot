import { PrimaryGeneratedColumn, ManyToOne, ManyToMany, DeleteResult, Entity, JoinTable } from 'typeorm';
import { DataEntity } from '/src/api/db';
import { lazyInject } from '/src/api/inversion';
import { ServiceIdentifiers, DataService } from '/src/api/services';
import { MessageHistory } from '/src/modules/message-link-embed-module/db/entity/message-history';

@Entity('msg_link_embed/message_link_history')
export class MessageLinkHistory extends DataEntity {

    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService!: DataService;

    async save(): Promise<this & MessageLinkHistory> {
        const repository = await this.dataService.getRepository(MessageLinkHistory);
        return repository.save(this);
    }

    async delete(): Promise<DeleteResult> {
        const repository = await this.dataService.getRepository(MessageLinkHistory);
        return repository.delete(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => MessageHistory)
    requestMessage: MessageHistory;

    @ManyToOne(() => MessageHistory)
    originMessage: MessageHistory;

    @ManyToMany(() => MessageHistory)
    @JoinTable({ name: 'msg_link_embed/join_messages_to_link_history' })
    resultMessages: MessageHistory[];
}
