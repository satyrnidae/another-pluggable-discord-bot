import { ModuleInfo } from '.';
import { Command, EventHandler } from '../entity';
import { Client } from 'discord.js';


export default abstract class Module {
    constructor(public moduleInfo: ModuleInfo) {}

    abstract preInitialize(): any;

    abstract initialize(): any;

    abstract postInitialize(client: Client): any;

    readonly commands: Command[];

    readonly events: EventHandler[];
}
