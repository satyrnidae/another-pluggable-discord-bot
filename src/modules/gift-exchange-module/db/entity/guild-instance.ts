import { DataEntity } from "api/db/entity";
import { lazyInject } from "api/inversion";
import { ServiceIdentifiers, DataService } from "api/services";
import { Repository, Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exchange } from "./exchange";

@Entity('@gex/GuildInstance')
export class GuildInstance extends DataEntity {

    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService: DataService;

    async save(): Promise<this & GuildInstance> {
        const repository: Repository<GuildInstance> = await this.dataService.getRepository(GuildInstance);
        return repository.save(this);
    }
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nativeId: string;

    @OneToMany(() => Exchange, exchange => exchange.guild, {cascade: ["remove"]})
    exchanges: Exchange[];
}
