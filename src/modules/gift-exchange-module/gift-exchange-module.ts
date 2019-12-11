import { Command, EventHandler, Module, ModuleInfo } from 'api/module';
import { GuildInstanceFactory } from 'modules/gift-exchange-module/db/factory';
import { Container } from 'api/inversion';
import { JoinExchangeCommand } from 'modules/gift-exchange-module/commands';

export default class GiftExchangeModule extends Module {

    readonly commands: Command[];
    readonly events: EventHandler[];

    constructor(moduleInfo: ModuleInfo) {
        super(moduleInfo);
        this.commands = [
            new JoinExchangeCommand(moduleInfo.id)
        ];
        this.events = [];
    }

    public async registerDependencies(): Promise<void> {
        Container.bind<GuildInstanceFactory>(GuildInstanceFactory).toSelf();

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
