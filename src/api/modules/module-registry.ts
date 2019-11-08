import { CommandRegistry } from "api/entity";
import { Module } from "api/modules";
import { Client } from "discord.js";

export default interface ModuleRegistry {

    loadModules(): Promise<Module[]>;

    preInitializeModules(modules: Module[]): Promise<Module[]>;

    initializeModules(client: Client, modules: Module[]): Promise<Module[]>;

    postInitializeModules(client: Client, modules: Module[]): Promise<Module[]>;
}