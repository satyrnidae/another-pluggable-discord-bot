import i18n = require('i18n');
import { Configuration, Container, SERVICE_IDENTIFIERS, EventHandler } from 'api'
import { Client } from 'discord.js'
import { sendWelcomeMessage } from 'core';

/** Handles the ready event from the discord client */
export default class ReadyHandler extends EventHandler {
    /** The name of the event */
    event: string = "ready";
    configuration: Configuration;

    constructor(moduleId: string) {
        super(moduleId);
        this.configuration = Container.get(SERVICE_IDENTIFIERS.CONFIGURATION);
    }

    /**
     * Handles the ready event
     * @param _getCommands Unused. A function to retrieve an enmap of all registed commands
     * @param client The discord client instance
     * @param _args Unused.  All other arguments.
     */
    handler(client: Client, ..._args: any[]): boolean {
        // register error handlers
        client.on("error", (e: string) => console.error(e))
        client.on("warn", (w: string) => console.warn(w))
        client.on("info", (i: string) => console.info(i))

        console.log(`${i18n.__("Logged in as")} ${client.user.tag}, ${i18n.__("and ready for service!")}`)

        if (this.configuration.welcomeMessage) {
            client.guilds.forEach(guild => {
                sendWelcomeMessage(client, guild, this.configuration)
            })
        }

        return true;
    }
}