import { Channel, GuildChannel, GroupDMChannel, DMChannel } from 'discord.js';
import { inject, injectable } from 'inversify';
import { DataEntityFactory } from '/src/api/db';
import { ChannelHistory } from '/src/modules/message-link-embed-module/db/entity';
import { ServiceIdentifiers, DataService } from '/src/api/services';
import { lazyInject } from '/src/api/inversion';
import { GuildHistoryFactory } from '/src/modules/message-link-embed-module/db/factory/guild-history-factory';

@injectable()
export class ChannelHistoryFactory implements DataEntityFactory<ChannelHistory> {

    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService) { }

    @lazyInject(GuildHistoryFactory)
    private readonly guildHistoryFactory!: GuildHistoryFactory;

    async load(channel: Channel, save = false): Promise<ChannelHistory> {
        if (!channel) {
            return null;
        }

        const repository = await this.dataService.getRepository(ChannelHistory);
        let channelHistory = await repository.findOne({ nativeId: channel.id });
        if (!channelHistory) {
            channelHistory = new ChannelHistory();
            channelHistory.nativeId = channel.id;
            if (channel instanceof GuildChannel) {
                channelHistory.guild = await this.guildHistoryFactory.load(channel.guild);
            }
            else {
                channelHistory.guild = await this.guildHistoryFactory.load();
            }
            if (save) {
                await channelHistory.save();
            }
        }
        if (channel instanceof GuildChannel || channel instanceof GroupDMChannel) {
            channelHistory.name = channel.name;
        }
        else if (channel instanceof DMChannel) {
            channelHistory.name = channel.recipient.username;
        }
        else {
            channelHistory.name = 'unknown';
        }
        return channelHistory;
    }
}
