import * as fs from 'fs';
import { Client } from 'discord.js';
import { Module, ModuleInfo } from '../../api/modules';
import { Command, EventHandler } from '../../api/entity';

export default class ExampleModule implements Module {
    moduleInfo: ModuleInfo;

    constructor() {
        this.moduleInfo = <ModuleInfo>JSON.parse(fs.readFileSync(`${__dirname}/module.json`).toString());
    }

    preInitialize() {
        console.info("PreInit for ExampleModule started.");
    }

    initialize() {
        console.info("Initialized example module.");
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