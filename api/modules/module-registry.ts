import { Module } from ".";
import { Client } from "discord.js";
import { CommandRegistry } from '../entity';

export default interface ModuleRegistry {

    loadModules(): Promise<Module[]>;

    preInitializeModules(modules: Module[]): Module[];

    initializeModules(client: Client, commandRegistry: CommandRegistry, modules: Module[]): Module[];

    postInitializeModules(client: Client, modules: Module[]): Module[];
}