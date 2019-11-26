import { DataEntityFactory } from 'api/db';
import { Channel, GuildChannel, GroupDMChannel, DMChannel } from 'discord.js';
import { inject, injectable } from 'inversify';
import { ServiceIdentifiers, DataService } from 'api/services';
import { lazyInject } from 'api/inversion';
import { ChannelHistory } from 'modules/message-link-embed-module/db/entity';
import { GuildHistoryFactory } from 'modules/message-link-embed-module/db/factory';

@injectable()
export class ChannelHistoryFactory implements DataEntityFactory<ChannelHistory> {
    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService) {}

    @lazyInject(GuildHistoryFactory)
    private readonly guildHistoryFactory!: GuildHistoryFactory;

    async load(channel: Channel): Promise<ChannelHistory> {
        if(!channel) {
            return null;
        }

        const repository = await this.dataService.getRepository(ChannelHistory);
        let object = await repository.findOne({nativeId: channel.id});
        if(!object) {
            object = new ChannelHistory();
            object.nativeId = channel.id;
            if(channel instanceof GuildChannel) {
                object.guild = await this.guildHistoryFactory.load(channel.guild);
            }
            else {
                object.guild = await this.guildHistoryFactory.load();
            }
        }
        if(channel instanceof GuildChannel || channel instanceof GroupDMChannel) {
            object.name = channel.name;
        }
        else if(channel instanceof DMChannel) {
            object.name = channel.recipient.username;
        }
        else object.name = 'unknown';
        return object;
    }

}