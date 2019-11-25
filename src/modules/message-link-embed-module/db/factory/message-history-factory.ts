import { DataEntityFactory } from 'api/db';
import { MessageHistory } from 'modules/message-link-embed-module/db/entity';
import { injectable, inject } from 'inversify';
import { ServiceIdentifiers, DataService } from 'api/services';
import { Message } from 'discord.js';
import { lazyInject } from 'api/inversion';
import { UserHistoryFactory, ChannelHistoryFactory } from 'modules/message-link-embed-module/db/factory';

@injectable()
export class MessageHistoryFactory implements DataEntityFactory<MessageHistory> {
    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService) {}

    @lazyInject(UserHistoryFactory)
    private readonly userHistoryFactory!: UserHistoryFactory;


    @lazyInject(ChannelHistoryFactory)
    private readonly channelHistoryFactory!: ChannelHistoryFactory;

    async load(message: Message): Promise<MessageHistory> {
        const repository = await this.dataService.getRepository(MessageHistory);
        let object = await repository.findOne({nativeId: message.id});
        if(!object) {
            object = new MessageHistory();
            object.nativeId = message.id;
            object.channel = await this.channelHistoryFactory.load(message.channel);
            object.user = await this.userHistoryFactory.load(message.author);
        }
        return object;
    }

}