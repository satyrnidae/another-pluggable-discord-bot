import { Module } from ".";
import { Client } from "discord.js";

export default interface ModuleRegistry {

    loadModules(): Promise<Module[]>;

    initializeModules(client: Client, module: Module[]): void;
}