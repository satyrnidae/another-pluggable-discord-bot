import { Command, EventHandler, Module, ModuleInfo } from 'api/module';
import { GuildInstanceFactory, ExchangeFactory } from 'modules/gift-exchange-module/db/factory';
import { Container } from 'api/inversion';
import { JoinExchangeCommand, AddExchangeCommand } from 'modules/gift-exchange-module/commands';
import { MessageService, ModuleServiceIdentifiers } from 'modules/gift-exchange-module/services';

export default class GiftExchangeModule extends Module {

    readonly commands: Command[];
    readonly events: EventHandler[];

    constructor(moduleInfo: ModuleInfo) {
        super(moduleInfo);
        this.commands = [
            new JoinExchangeCommand(moduleInfo.id),
            new AddExchangeCommand(moduleInfo.id)
        ];
        this.events = [];
    }

    public async registerDependencies(): Promise<void> {
        Container.bind<MessageService>(ModuleServiceIdentifiers.Message).to(MessageService);

        Container.bind<GuildInstanceFactory>(GuildInstanceFactory).toSelf();
        Container.bind<ExchangeFactory>(ExchangeFactory).toSelf();

        await super.registerDependencies();
    }

    public async preInitialize(): Promise<void> {
        return super.preInitialize();
    }

    public async initialize(): Promise<void> {
        return super.initialize();
    }

    public async postInitialize() : Promise<void> {
        return super.postInitialize();
    }
}
