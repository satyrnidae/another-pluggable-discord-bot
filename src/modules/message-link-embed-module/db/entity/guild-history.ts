import { DataEntity } from 'api/db';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { lazyInject } from 'api/inversion';
import { ServiceIdentifiers, DataService } from 'api/services';
import { ChannelHistory } from 'modules/message-link-embed-module/db/entity';

@Entity('MsgLinkEmbed_GuildHistory')
export class GuildHistory implements DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService!: DataService;

    async save(): Promise<this & GuildHistory> {
        const repository = await this.dataService.getRepository(GuildHistory);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nativeId: string;

    @OneToMany(() => ChannelHistory, channel => channel.guild)
    channels: ChannelHistory[];
}