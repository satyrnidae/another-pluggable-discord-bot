import { CommandRegistry } from "api/entity";
import { Module } from "api/modules";
import { Client } from "discord.js";

export default interface ModuleRegistry {

    loadModules(): Promise<Module[]>;

    preInitializeModules(modules: Module[]): Module[];

    initializeModules(client: Client, commandRegistry: CommandRegistry, modules: Module[]): Module[];

    postInitializeModules(client: Client, modules: Module[]): Module[];
}