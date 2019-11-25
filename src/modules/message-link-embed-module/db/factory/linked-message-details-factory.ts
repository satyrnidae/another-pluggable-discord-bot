import { DataEntityFactory, lazyInject, ServiceIdentifiers, DataService } from "api";

import { Message } from "discord.js";
import { Repository } from "typeorm";
import { LinkedMessageDetails, UserLinkingPreferences } from "../entity";
import { UserLinkingPreferencesFactory } from ".";

export default class LinkedMessageDetailsFactory extends DataEntityFactory<LinkedMessageDetails> {

    @lazyInject(ServiceIdentifiers.Data)
    dataService: DataService;

    async load(originMessage: Message, requestMessage: Message, targetMessage: Message): Promise<LinkedMessageDetails> {
        const repository: Repository<LinkedMessageDetails> = await this.dataService.getRepository(LinkedMessageDetails);
        let dataEntity: LinkedMessageDetails = await repository.findOne({
            originGuildId: originMessage.guild ? originMessage.guild.id : '@me',
            originChannelId: originMessage.channel.id,
            originMessageId: originMessage.id,
            targetGuildId: targetMessage.guild ? targetMessage.guild.id : '@me',
            targetChannelId: targetMessage.channel.id,
            targetMessageId: targetMessage.id,
            requestorId: requestMessage.author.id,
            senderId: originMessage.author.id
        });

        if(!dataEntity) {
            const userPreferences: UserLinkingPreferences = await new UserLinkingPreferencesFactory().load(originMessage.author.id);
            dataEntity = new LinkedMessageDetails();
            dataEntity.originGuildId = originMessage.guild ? originMessage.guild.id : '@me';
            dataEntity.originChannelId = originMessage.channel.id;
            dataEntity.originMessageId = originMessage.id;
            dataEntity.targetGuildId = targetMessage.guild ? targetMessage.guild.id : '@me';
            dataEntity.targetChannelId = targetMessage.channel.id;
            dataEntity.targetMessageId = targetMessage.id;
            dataEntity.requestorId = requestMessage.author.id;
            dataEntity.senderId = originMessage.author.id;
            dataEntity.senderPreferences = userPreferences;

            await dataEntity.save();
        }

        return dataEntity;
    }
}