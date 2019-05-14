import Enmap from 'enmap';
import { Command } from '.';
import { Module } from '../modules';

export default interface CommandRegistry {
    registry: Enmap<string, Enmap<string, Command>>;

    register(parentModule: Module, command: Command): boolean;

    get(name: string, moduleId?: string): Command[];

    getAll(moduleId?: string): Command[];
}