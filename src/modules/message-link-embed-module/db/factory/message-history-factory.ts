import { injectable, inject } from 'inversify';
import { Message } from 'discord.js';
import { DataEntityFactory } from '/src/api/db';
import { ServiceIdentifiers, DataService } from '/src/api/services';
import { lazyInject } from '/src/api/inversion';
import { MessageHistory } from '/src/modules/message-link-embed-module/db/entity';
import { UserSettingsFactory } from '/src/modules/message-link-embed-module/db/factory/user-settings-factory';
import { ChannelHistoryFactory } from '/src/modules/message-link-embed-module/db/factory/channel-history-factory';

@injectable()
export class MessageHistoryFactory implements DataEntityFactory<MessageHistory> {
    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService) { }

    @lazyInject(UserSettingsFactory)
    private readonly userHistoryFactory!: UserSettingsFactory;


    @lazyInject(ChannelHistoryFactory)
    private readonly channelHistoryFactory!: ChannelHistoryFactory;

    async load(message: Message): Promise<MessageHistory> {
        const repository = await this.dataService.getRepository(MessageHistory);
        let messageHistory = await repository.findOne({ nativeId: message.id });
        if (!messageHistory) {
            messageHistory = new MessageHistory();
            messageHistory.nativeId = message.id;
            messageHistory.channel = await this.channelHistoryFactory.load(message.channel);
            messageHistory.user = await this.userHistoryFactory.load(message.author);
        }
        return messageHistory;
    }
}
