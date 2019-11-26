import * as i18n from 'i18n';
import { MessageService, CoreModuleServiceIdentifiers } from 'core/module/services';
import { CommandHandler, ReadyHandler, GuildCreateHandler } from 'core/module/events';
import { HelpCommand, SetPrefixCommand } from 'core/module/commands';
import { Module, EventHandler, Command, Version } from 'api/module';
import { Container } from 'api/inversion';

export default class CoreModule extends Module {
    private coreEvents: EventHandler[];
    private coreCommands: Command[];

    public constructor() {
        super({
            name: 'Core Module',
            version: '1.0.0',
            id: 'core-module',
            authors: [ 'satyrnidae' ],
            details: {
                apiVersion: Version,
                entryPoint: 'core-module',
                commands: [],
                eventHandlers: []
            }
        });
    }

    async registerDependencies(): Promise<void> {
        Container.bind<MessageService>(CoreModuleServiceIdentifiers.Message).to(MessageService);
        return super.registerDependencies();
    }

    async preInitialize(): Promise<void> {
        this.coreEvents = [
            new CommandHandler(this.moduleInfo.id),
            new ReadyHandler(this.moduleInfo.id),
            new GuildCreateHandler(this.moduleInfo.id)
        ];
        this.coreCommands = [
            new HelpCommand(this.moduleInfo.id),
            new SetPrefixCommand(this.moduleInfo.id)
        ];
        return super.preInitialize();
    }

    async postInitialize() : Promise<void> {
        console.info(i18n.__('Loaded core module components'));
        return super.postInitialize();
    }

    get commands(): Command[] {
        return this.coreCommands;
    }

    get events(): EventHandler[] {
        return this.coreEvents;
    }
}
