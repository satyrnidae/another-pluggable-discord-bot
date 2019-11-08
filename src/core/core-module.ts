import { Client } from 'discord.js';
import i18n = require('i18n');
import { Module, ModuleInfo, EventHandler, Command } from 'api';
import { CommandHandler, ReadyHandler } from 'core/events';
import HelpCommand from 'core/commands/help-command';

export default class CoreModule extends Module {

    private coreEvents: EventHandler[];
    private coreCommands: Command[];

    async preInitialize(): Promise<any> {
        this.coreEvents = [
            new CommandHandler(this.moduleInfo.id),
            new ReadyHandler(this.moduleInfo.id)
        ];
        this.coreCommands = [
            new HelpCommand(this.moduleInfo.id)
        ];

        return Promise.resolve();
    }

    async postInitialize(client: Client) : Promise<any> {
        console.info(i18n.__('Loaded core module components'));

        return await super.postInitialize(client);
    }

    get commands(): Command[] {
        return this.coreCommands;
    }

    get events(): EventHandler[] {
        return this.coreEvents;
    }
}