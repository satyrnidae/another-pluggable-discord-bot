import { Client } from 'discord.js';
import * as i18n from 'i18n';
import { Module, ModuleInfo, EventHandler } from 'api';
import { MessageEventHandler } from 'core/events';

export default class CoreModule extends Module {

    private coreEvents: EventHandler[];

    public constructor(moduleInfo: ModuleInfo) {
        super(moduleInfo);
        this.coreEvents = [
            new MessageEventHandler(moduleInfo.id)
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