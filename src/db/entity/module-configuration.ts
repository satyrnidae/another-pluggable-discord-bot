import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DataEntity } from '/src/api/db';
import { lazyInject } from '/src/api/inversion';
import { ServiceIdentifiers, DataService } from '/src/api/services';
import { GuildConfiguration } from '/src/db/entity';

@Entity('$module')
export class ModuleConfiguration extends DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService!: DataService;

    async save(): Promise<this & DataEntity> {
        const repository = await this.dataService.getRepository(ModuleConfiguration);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    moduleId: string;

    @Column({default: true})
    isEnabled: boolean;

    @ManyToOne(() => GuildConfiguration, guild => guild.modules, {cascade: ['insert']})
    @JoinColumn({name: 'guild_id'})
    guild: GuildConfiguration;
}
