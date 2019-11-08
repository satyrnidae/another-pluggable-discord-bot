import { Client } from 'discord.js';
import i18n = require('i18n');
import { Module, ModuleInfo, EventHandler } from 'api';
import { CommandHandler, ReadyHandler } from 'core/events';

export default class CoreModule extends Module {

    private coreEvents: EventHandler[];

    public constructor(moduleInfo: ModuleInfo) {
        super(moduleInfo);
        this.coreEvents = [
            new CommandHandler(moduleInfo.id),
            new ReadyHandler(moduleInfo.id)
        ];
    }

    async postInitialize(client: Client) : Promise<any> {
        console.info(i18n.__('Loaded core module components'));

        return await super.postInitialize(client);
    }

    get events(): EventHandler[] {
        return this.coreEvents;
    }
}