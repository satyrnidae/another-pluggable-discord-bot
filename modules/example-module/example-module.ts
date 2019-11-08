import { Client } from 'discord.js';
import { Command, EventHandler, Module } from 'api';
export default class ExampleModule extends Module {

    preInitialize() {
    }

    initialize() {
    }

    postInitialize(client: Client) {
        console.info("Finished loading ExampleModule");
    }

    get commands(): Command[] {
        return [];
    }

    get events(): EventHandler[] {
        return [];
    }
}