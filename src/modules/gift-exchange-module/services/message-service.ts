import * as i18n from 'i18n';
import { injectable, inject } from 'inversify';
import { ServiceIdentifiers, ClientService } from 'api/services';
import { PartialTextBasedChannelFields } from 'discord.js';
import { Exchange } from 'modules/gift-exchange-module/db/entity';

@injectable()
export class MessageService {

    constructor(@inject(ServiceIdentifiers.Client) private readonly clientService: ClientService) {}

    async sendExchangeNameMissingMessage(channel: PartialTextBasedChannelFields): Promise<void> {
        await channel.send(i18n.__('I can\'t create an exchange without a name! Please specify the --name parameter.').concat('\r\n')
            .concat(i18n.__('See the help page for `addexchange` for more details!')));
    }

    async sendGuildOnlyCommandMessage(channel: PartialTextBasedChannelFields): Promise<void> {
        await channel.send(i18n.__('This command may only be executed in a guild! Sorry...'));
    }

    async exchangeAlreadyExists(channel: PartialTextBasedChannelFields, exchange: Exchange): Promise<void> {
        await channel.send(i18n.__('An exchange with the name "%s" already exists!', exchange.name));
    }

    async sendExchangeAddedMessage(channel: PartialTextBasedChannelFields, exchange: Exchange): Promise<void> {
        await channel.send(i18n.__('The exchange "%s" has been created.', exchange.name));
    }
}