import { ModuleInfo } from '.';
import { Command, EventHandler } from '../entity';


export default interface Module {
    moduleInfo: ModuleInfo;

    initialize(): any;

    readonly commands: Command[];

    readonly events: EventHandler[];
}
