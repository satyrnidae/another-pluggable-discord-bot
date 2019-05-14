import * as fs from 'fs';
import { Client } from 'discord.js';
import { Module, ModuleInfo } from '../../api/modules';

export default class ExampleModule implements Module {
    moduleInfo: ModuleInfo;

    constructor() {
        this.moduleInfo = <ModuleInfo>JSON.parse(fs.readFileSync(`${__dirname}/module.json`).toString());
    }

    initialize(client: Client) {
        console.info("Initialized example module.");
    }
    
}