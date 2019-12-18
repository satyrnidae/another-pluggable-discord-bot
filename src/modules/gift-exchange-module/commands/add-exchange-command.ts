import * as i18n from 'i18n';
import { Message } from 'discord.js';
import { Options, Arguments } from 'yargs-parser';
import { Command } from 'api/module';
import { MessageService, ModuleServiceIdentifiers } from 'modules/gift-exchange-module/services';
import { lazyInject } from 'api/inversion';
import { Exchange } from 'modules/gift-exchange-module/db/entity';
import { ExchangeFactory } from 'modules/gift-exchange-module/db/factory';

export class AddExchangeCommand extends Command {
    readonly friendlyName: string = i18n.__('Add Exchange');
    readonly command: string = 'addexchange';
    readonly syntax: string[] = ['addexchange [-n|--name] *name*'];
    readonly description: string = i18n.__('Adds a new exchange to the current guild.');
    readonly options: Options = {
        alias: {
            name: ['-n']
        },
        string: ['name'],
        configuration: {
            'duplicate-arguments-array': false
        }
    };

    @lazyInject(ModuleServiceIdentifiers.Message)
    private readonly messageService: MessageService;

    @lazyInject(ExchangeFactory)
    private readonly exchangeFactory: ExchangeFactory;

    async run(message: Message, args: Arguments): Promise<void> {
        if (!message.guild) {
            await this.messageService.sendGuildOnlyCommandMessage(message.author);
            return;
        }
        const name: string = args['name'] || args._[0];
        if(!name) {
            await this.messageService.sendExchangeNameMissingMessage(message.channel);
            return;
        }
        const exchangeInstance: Exchange = await this.exchangeFactory.load(message.guild, name, false);
        if (exchangeInstance.id) {
            await this.messageService.exchangeAlreadyExists(message.channel, exchangeInstance);
            return;
        }
        await exchangeInstance.save();
        await this.messageService.sendExchangeAddedMessage(message.channel, exchangeInstance);
    }

    async checkPermissions(message: Message): Promise<boolean> {
        if(!message.guild) {
            return true;
        }
        const member = message.guild.member(message.author);
        return member && member.hasPermission('ADMINISTRATOR');
    }
}
