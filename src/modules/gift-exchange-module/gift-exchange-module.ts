import { Module, Command, EventHandler, ModuleInfo } from '/src/api/module';
import { Container } from '/src/api/inversion';
import { JoinExchangeCommand, AddExchangeCommand } from '/src/modules/gift-exchange-module/commands';
import { MessageService, ModuleServiceIdentifiers } from '/src/modules/gift-exchange-module/services';
import { GuildInstanceFactory, ExchangeFactory } from '/src/modules/gift-exchange-module/db/factory';

export default class GiftExchangeModule extends Module {
    private readonly _commands: Command[];
    private readonly _events: EventHandler[];

    get commands() {
        return new Array(...this._commands);
    }

    get events() {
        return new Array(...this._events);
    }

    constructor(moduleInfo: ModuleInfo) {
        super(moduleInfo);
        this._commands = [
            new JoinExchangeCommand(moduleInfo.id),
            new AddExchangeCommand(moduleInfo.id)
        ];
        this._events = [];
    }

    public async registerDependencies(): Promise<void> {
        Container.bind<MessageService>(ModuleServiceIdentifiers.Message).to(MessageService);
        Container.bind<GuildInstanceFactory>(GuildInstanceFactory).toSelf();
        Container.bind<ExchangeFactory>(ExchangeFactory).toSelf();

        await super.registerDependencies();
    }
}
