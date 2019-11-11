import i18n = require('i18n');
import { Configuration, Container, SERVICE_IDENTIFIERS, EventHandler, forEachAsync } from 'api'
import { Client, Guild } from 'discord.js'
import { sendWelcomeMessage } from 'core';

export default class ReadyHandler extends EventHandler {
    event: string = 'ready';
    configuration: Configuration;

    constructor(moduleId: string) {
        super(moduleId);
        this.configuration = Container.get(SERVICE_IDENTIFIERS.CONFIGURATION);
    }

    public async handler(client: Client, ..._args: any[]): Promise<any> {
        client.on('error', (e: string) => console.error(e))
        client.on('warn', (w: string) => console.warn(w))
        client.on('info', (i: string) => console.info(i))

        console.log(`${i18n.__('Logged in as ')}${client.user.tag}${i18n.__(', and ready for service!')}`)

        if (this.configuration.welcomeMessage) {
            return await forEachAsync(client.guilds.array(), async (guild: Guild): Promise<void> => {
                await sendWelcomeMessage(client, guild, this.configuration);
                return Promise.resolve();
            });
        }

        return Promise.resolve();
    }
}
