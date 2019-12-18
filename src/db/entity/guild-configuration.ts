import { Entity, PrimaryGeneratedColumn, Column, Repository, OneToMany } from 'typeorm';
import { lazyInject } from '/src/api/inversion';
import { DataEntity } from '/src/api/db';
import { ServiceIdentifiers, DataService } from '/src/api/services';
import { ModuleConfiguration } from '/src/db/entity/module-configuration';

@Entity('$guild')
export class GuildConfiguration extends DataEntity {

    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService: DataService;

    async save(): Promise<this & GuildConfiguration> {
        const guildRepository: Repository<GuildConfiguration> = await this.dataService.getRepository(GuildConfiguration);
        return guildRepository.save(this);
    }

    /**
     * The primary ID column
     */
    @PrimaryGeneratedColumn()
    id: number;

    /**
     * The Discord native ID for the guild
     */
    @Column({unique: true})
    nativeId: string;

    /**
     * The guild command prefix setting
     */
    @Column()
    commandPrefix: string;

    /**
     * Whether or not the welcome message has been sent
     */
    @Column()
    welcomeMsgSent: boolean;

    /**
     * The module configuration entries for the guild
     */
    @OneToMany(() => ModuleConfiguration, module => module.guild, {cascade: ['remove']})
    modules: ModuleConfiguration[];
}
