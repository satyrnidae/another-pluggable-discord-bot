import { DataEntity } from 'api/db';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { lazyInject } from 'api/inversion';
import { ServiceIdentifiers, DataService } from 'api/services';
import { GuildHistory, MessageHistory } from 'modules/message-link-embed-module/db/entity';

@Entity('MsgLinkEmbed_ChannelHistory')
export class ChannelHistory implements DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService!: DataService;

    async save(): Promise<this & ChannelHistory> {
        const repository = await this.dataService.getRepository(ChannelHistory);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nativeId: string;

    @ManyToOne(() => GuildHistory, guild => guild.channels)
    guild: GuildHistory;

    @OneToMany(() => MessageHistory, message => message.channel)
    messages: MessageHistory[];
}