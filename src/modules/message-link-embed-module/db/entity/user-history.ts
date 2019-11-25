import { DataEntity } from 'api/db';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { lazyInject } from 'api/inversion';
import { ServiceIdentifiers, DataService } from 'api/services';
import { MessageHistory } from 'modules/message-link-embed-module/db/entity/message-history';

@Entity('MsgLinkEmbed_UserHistory')
export class UserHistory implements DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService!: DataService;

    async save(): Promise<this & UserHistory> {
        const repository = await this.dataService.getRepository(UserHistory);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nativeId: string;

    @OneToMany(() => MessageHistory, message => message.user)
    messages: MessageHistory[];
}