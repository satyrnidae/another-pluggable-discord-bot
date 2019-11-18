import i18n = require('i18n');
import { Module, EventHandler, Command, Version, Container } from 'api';
import { CommandHandler, ReadyHandler, HelpCommand, GuildCreateHandler, SetPrefixCommand, MessageService } from 'core';
import { MessageServiceBase } from 'core/module/services';

export default class CoreModule extends Module {
    private coreEvents: EventHandler[];
    private coreCommands: Command[];

    //TODO: Module DI?
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
        Container.bind<MessageService>('CoreMessageService').to(MessageServiceBase);
        return await super.registerDependencies();
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
        return await super.preInitialize();
    }

    async postInitialize() : Promise<void> {
        console.info(i18n.__('Loaded core module components'));

        return await super.postInitialize();
    }

    get commands(): Command[] {
        return this.coreCommands;
    }

    get events(): EventHandler[] {
        return this.coreEvents;
    }
}
