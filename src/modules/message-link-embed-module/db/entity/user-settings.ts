import { DataEntity } from 'api/db';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { lazyInject } from 'api/inversion';
import { ServiceIdentifiers, DataService, ClientService } from 'api/services';
import { MessageHistory } from 'modules/message-link-embed-module/db/entity/message-history';
import { User } from 'discord.js';

@Entity('msg_link_embed_user_settings')
export class UserSettings extends DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService!: DataService;

    @lazyInject(ServiceIdentifiers.Client)
    private readonly clientService!: ClientService;

    async save(): Promise<this & UserSettings> {
        const repository = await this.dataService.getRepository(UserSettings);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    nativeId: string;

    @Column()
    name: string;

    @Column({default: true})
    linkingEnabled: boolean;

    @Column({default: false})
    linkToNonPresent: boolean;

    @Column({default: false})
    linkFromNonPresent: boolean;

    @Column({default: false})
    linkFromDMs: boolean;

    @Column({default: false})
    linkToDMs: boolean;

    @OneToMany(() => MessageHistory, message => message.user, {cascade: ['remove']})
    messages: MessageHistory[];

    async getNativeUser(): Promise<User> {
        return this.clientService.client.fetchUser(this.nativeId);
    }
}
