import { Client } from "discord.js";

export default interface EventHandler {
    name: string;

    handle(client: Client, ...args: any[]): boolean;
}