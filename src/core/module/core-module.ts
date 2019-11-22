import i18n = require('i18n');
import { Module, EventHandler, Command, Version, Container } from 'api';
import { CommandHandler, ReadyHandler, HelpCommand, GuildCreateHandler, SetPrefixCommand, MessageService, CoreModuleServiceIdentifiers } from 'core';

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
            new CommandHandler(),
            new ReadyHandler(),
            new GuildCreateHandler()
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
