import { Client } from 'discord.js';
import { Command, EventHandler, Module } from 'api';
export default class ExampleModule extends Module {

    async postInitialize(client: Client) : Promise<any> {
        console.info("Finished loading ExampleModule");

        return await super.postInitialize(client);
    }

    get commands(): Command[] {
        return [];
    }

    get events(): EventHandler[] {
        return [];
    }
}