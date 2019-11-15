import i18n = require('i18n');
import { Client } from 'discord.js';
import { Module, EventHandler, Command, Version } from 'api';
import { CommandHandler, ReadyHandler, HelpCommand, GuildCreateHandler } from 'core';

export default class CoreModule extends Module {
    private coreEvents: EventHandler[];
    private coreCommands: Command[];

    public constructor() {
        super( {
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

    async preInitialize(_: Client): Promise<void> {
        this.coreEvents = [
            new CommandHandler(this.moduleInfo.id),
            new ReadyHandler(this.moduleInfo.id),
            new GuildCreateHandler(this.moduleInfo.id)
        ];
        this.coreCommands = [
            new HelpCommand(this.moduleInfo.id)
        ];

        return Promise.resolve();
    }

    async postInitialize(client: Client) : Promise<void> {
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
