import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Message, Channel, TextChannel } from 'discord.js';
import { DataEntity } from '/src/api/db';
import { lazyInject } from '/src/api/inversion';
import { ServiceIdentifiers, DataService } from '/src/api/services';
import { ChannelHistory } from '/src/modules/message-link-embed-module/db/entity/channel-history';
import { UserSettings } from '/src/modules/message-link-embed-module/db/entity/user-settings';

@Entity('msg_link_embed/message_history')
export class MessageHistory extends DataEntity {

    @lazyInject(ServiceIdentifiers.Data)
    private readonly dataService!: DataService;

    async save(): Promise<this & MessageHistory> {
        const repository = await this.dataService.getRepository(MessageHistory);
        return repository.save(this);
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    nativeId: string;

    @ManyToOne(() => ChannelHistory, channel => channel.messages, { cascade: ['insert'] })
    channel: ChannelHistory;

    @ManyToOne(() => UserSettings, user => user.messages, { cascade: ['insert'] })
    user: UserSettings;

    async getNativeMessage(): Promise<Message> {
        const channel: Channel = this.channel.getNativeChannel();
        if (channel instanceof TextChannel) {
            return channel.fetchMessage(this.nativeId);
        }
        return null;
    }
}
