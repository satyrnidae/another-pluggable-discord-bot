import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Guild } from 'discord.js';
import { DataEntity } from '/src/api/db';
import { lazyInject } from '/src/api/inversion';
import { ServiceIdentifiers, DataService, ClientService } from '/src/api/services';
import { ChannelHistory } from '/src/modules/message-link-embed-module/db/entity/channel-history';

@Entity('msg_link_embed/guild_history')
export class GuildHistory extends DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService!: DataService;

    @lazyInject(ServiceIdentifiers.Client)
    private readonly clientService!: ClientService;

    async save(): Promise<this & GuildHistory> {
        const repository = await this.dataService.getRepository(GuildHistory);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    nativeId: string;

    @OneToMany(() => ChannelHistory, channel => channel.guild)
    channels: ChannelHistory[];

    getNativeGuild(): Guild {
        if (this.nativeId === '@me') {
            return null;
        }
        return this.clientService.guilds.find(guild => guild.id === this.nativeId);
    }
}
