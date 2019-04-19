import { Client } from 'discord.js';
import { ModuleInfo } from '.';


export default interface Module {
    moduleInfo: ModuleInfo;

    initialize(client: Client): any;
}
