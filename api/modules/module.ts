import { ModuleInfo } from '.';
import { Command, EventHandler } from '../entity';
import { Client } from 'discord.js';


export default interface Module {
    moduleInfo: ModuleInfo;

    preInitialize(): any;

    initialize(): any;

    postInitialize(client: Client): any;

    readonly commands: Command[];

    readonly events: EventHandler[];
}
