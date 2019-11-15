import i18n = require('i18n');
import { AppConfiguration, Container, SERVICE_IDENTIFIERS, EventHandler, forEachAsync, DBConnection } from 'api'
import { Client, Guild } from 'discord.js'
import { sendGuildWelcomeMessage } from 'core/messages';

export default class ReadyHandler extends EventHandler {
    event: string = 'ready';

    constructor(moduleId: string) {
        super(moduleId);
    }

    public async handler(client: Client, ..._args: any[]): Promise<any> {
        client.on('error', (e: string) => console.error(e))
        client.on('warn', (w: string) => console.warn(w))
        client.on('info', (i: string) => console.info(i))

        console.log(`${i18n.__('Logged in as ')}${client.user.tag}${i18n.__(', and ready for service!')}`)

        return await forEachAsync(client.guilds.array(), async (guild: Guild): Promise<boolean> => {
            await sendGuildWelcomeMessage(client, guild);
            return false;
        });
    }
}
