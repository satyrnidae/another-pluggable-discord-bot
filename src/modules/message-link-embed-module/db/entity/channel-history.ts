import { DataEntity } from 'api/db';
import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { lazyInject } from 'api/inversion';
import { ServiceIdentifiers, DataService, ClientService } from 'api/services';
import { GuildHistory, MessageHistory } from 'modules/message-link-embed-module/db/entity';
import { Channel, Guild } from 'discord.js';

@Entity('msg_link_embed/channel_history')
export class ChannelHistory extends DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService!: DataService;

    @lazyInject(ServiceIdentifiers.Client)
    private readonly clientService!: ClientService;

    async save(): Promise<this & ChannelHistory> {
        const repository = await this.dataService.getRepository(ChannelHistory);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    nativeId: string;

    @ManyToOne(() => GuildHistory, guild => guild.channels, {cascade: true})
    guild: GuildHistory;

    @OneToMany(() => MessageHistory, message => message.channel)
    messages: MessageHistory[];

    getNativeChannel(): Channel {
        const myGuild: Guild = this.guild.getNativeGuild();
        if(!myGuild) {
            return this.clientService.client.channels.find(channel => channel.id === this.nativeId);
        }
        return myGuild.channels.find(channel => channel.id === this.nativeId);
    }
}
