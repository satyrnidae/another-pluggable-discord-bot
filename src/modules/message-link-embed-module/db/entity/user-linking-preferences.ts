import { Entity, Repository, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DataEntity, lazyInject, ServiceIdentifiers, DataService, ClientService } from 'api';
import { User } from 'discord.js';

@Entity()
export default class UserLinkingPreferences extends DataEntity {

    @lazyInject(ServiceIdentifiers.Data)
    dataService: DataService;

    @lazyInject(ServiceIdentifiers.Client)
    clientService: ClientService;

    async save(): Promise<this & UserLinkingPreferences> {
        const repository: Repository<UserLinkingPreferences> = await this.dataService.getRepository(UserLinkingPreferences);
        return repository.save(this);
    }

    async resolve(): Promise<User> {
        return this.clientService.client.fetchUser(this.nativeId);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nativeId: string;

    @Column()
    linkingEnabled: boolean;

    @Column()
    linkFromInactiveGuilds: boolean;

    @Column()
    linkToExternalGuilds: boolean;
}
