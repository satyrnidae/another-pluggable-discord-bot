import { DataEntity } from 'api/db';
import { lazyInject } from 'api/inversion';
import { ServiceIdentifiers, DataService } from 'api/services';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ChannelHistory, UserSettings } from 'modules/message-link-embed-module/db/entity';
import { Message, Channel, TextChannel, PartialTextBasedChannel, TextBasedChannel } from 'discord.js';

@Entity('msg_link_embed_message_history')
export class MessageHistory extends DataEntity {
    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService!: DataService;

    async save(): Promise<this & MessageHistory> {
        const repository = await this.dataService.getRepository(MessageHistory);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    nativeId: string;

    @ManyToOne(() => ChannelHistory, channel => channel.messages, {cascade: ['insert']})
    channel: ChannelHistory;

    @ManyToOne(() => UserSettings, user => user.messages, {cascade: ['insert']})
    user: UserSettings;

    async getNativeMessage(): Promise<Message> {
        const channel: Channel = this.channel.getNativeChannel();
        if(channel instanceof TextChannel) {
            return channel.fetchMessage(this.nativeId);
        }
        return null;
    }
}