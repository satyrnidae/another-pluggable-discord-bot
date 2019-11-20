import { Entity, Repository, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DataEntity, lazyInject, ServiceIdentifiers, DataService } from 'api';

@Entity()
export default class UserLinkingPreferences extends DataEntity {

    @lazyInject(ServiceIdentifiers.Data)
    dataService: DataService;

    async save(): Promise<this & UserLinkingPreferences> {
        const repository: Repository<UserLinkingPreferences> = await this.dataService.getRepository(UserLinkingPreferences);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nativeId: string;

    @Column()
    linkingEnabled: boolean;
}