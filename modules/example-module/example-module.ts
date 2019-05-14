import * as fs from 'fs';
import { Client } from 'discord.js';
import { Module, ModuleInfo } from '../../api/modules';
import { Command, EventHandler } from '../../api/entity';

export default class ExampleModule implements Module {
    moduleInfo: ModuleInfo;

    constructor() {
        this.moduleInfo = <ModuleInfo>JSON.parse(fs.readFileSync(`${__dirname}/module.json`).toString());
    }

    initialize() {
        console.info("Initialized example module.");
    }

    get commands(): Command[] {
        return [];
    }

    get events(): EventHandler[] {
        return [];
    }
}