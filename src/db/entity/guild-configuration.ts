import { Entity, PrimaryGeneratedColumn, Column, Repository } from 'typeorm';
import { DataEntity } from 'api/db';
import { lazyInject } from 'api/inversion';
import { ServiceIdentifiers, DataService } from 'api/services';

@Entity()
export default class GuildConfiguration extends DataEntity {

    @lazyInject(ServiceIdentifiers.Data)
    dataService: DataService;

    async save(): Promise<this & GuildConfiguration> {
        const guildRepository: Repository<GuildConfiguration> = await this.dataService.getRepository(GuildConfiguration);
        return guildRepository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nativeId: string;

    @Column()
    commandPrefix: string;

    @Column()
    welcomeMsgSent: boolean;
}
