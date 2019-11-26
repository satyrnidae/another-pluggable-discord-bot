import { DataEntity } from 'api/db';
import { lazyInject } from 'api/inversion';
import { ServiceIdentifiers, DataService } from 'api/services';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('core/module_entity')
export class ModuleEntity extends DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService!: DataService;

    async save(): Promise<this & DataEntity> {
        const repository = await this.dataService.getRepository(ModuleEntity);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    moduleId: string;

    @Column({default: true})
    isEnabled: boolean;
}
