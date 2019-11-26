import { DataEntity } from 'api/db';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { lazyInject } from 'api/inversion';
import { ServiceIdentifiers, DataService, ClientService } from 'api/services';
import { ChannelHistory } from 'modules/message-link-embed-module/db/entity';
import { Guild } from 'discord.js';

@Entity('msg_link_embed_guild_history')
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

    @Column({unique: true})
    nativeId: string;

    @OneToMany(() => ChannelHistory, channel => channel.guild)
    channels: ChannelHistory[];

    getNativeGuild(): Guild {
        if(this.nativeId === '@me') {
            return null;
        }
        return this.clientService.guilds.find(guild => guild.id === this.nativeId);
    }
}
