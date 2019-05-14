import { Module } from ".";
import { Client } from "discord.js";
import { CommandRegistry } from '../entity';

export default interface ModuleRegistry {

    loadModules(): Promise<Module[]>;

    initializeModules(client: Client, commandRegistry: CommandRegistry, module: Module[]): void;
}