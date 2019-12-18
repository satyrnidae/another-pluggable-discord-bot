import * as i18n from 'i18n';
import { Module, EventHandler, Command, Version } from '/src/api/module';
import { Container } from '/src/api/inversion';
import { MessageService, CoreModuleServiceIdentifiers } from '/src/core/module/services';
import { CommandHandler, GuildCreateHandler, ReadyHandler } from '/src/core/module/events';
import { HelpCommand, SetPrefixCommand } from '/src/core/module/commands';

export class CoreModule extends Module {
    private coreEvents: EventHandler[];
    private coreCommands: Command[];

    public constructor() {
        super({
            name: 'Core Module',
            version: Version,
            id: '$core',
            details: {
                apiVersion: Version,
                entryPoint: '/src/core/module',
                authors: [ 'Isabel Maskrey (satyrnidae)' ],
                description: 'Provides core functionality for the modular discord bot.',
                website: 'https://github.com/satyrnidae/another-pluggable-discord-bot'
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
