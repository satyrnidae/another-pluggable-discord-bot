import i18n = require('i18n');
import { Command, lazyInject, AppConfiguration, SERVICE_IDENTIFIERS } from 'api';
import { Options, Arguments } from 'yargs-parser';
import { Message, Client } from 'discord.js';
import { GuildConfiguration } from 'db';

export default class SetPrefixCommand extends Command {
    name: string = 'setPrefix';
    command: string = 'setPrefix';
    syntax: string[] = ['setPrefix [-p|--prefix] *prefix*'];
    description: string = i18n.__('Allows a guild admin to set the command prefix for the guild.');
    options: Options = {
        alias: {
            prefix: ['-p']
        },
        string: ['prefix'],
        configuration: {
            'duplicate-arguments-array': false
        }
    }

    async run(_: Client, message: Message, args: Arguments): Promise<any> {
        if(!message.guild) {
            message.reply(i18n.__('I\'m sorry, but I\'m afraid you can\'t change the prefix in a direct message!'));
        }

        const guildConfiguration: GuildConfiguration = await GuildConfiguration.load(message.guild);
        const prefix: string = args['prefix'] || args._[0];

        if(guildConfiguration && prefix) {
            guildConfiguration.commandPrefix = prefix;
            await guildConfiguration.save();
            return await message.reply(i18n.__('Guild prefix successfully updated to ').concat(`\`${guildConfiguration.commandPrefix}\``)
                .concat(i18n.__('!')));
        }
        return await message.reply(i18n.__('Unfortunately, I wasn\'t able to update the prefix to ').concat(prefix).concat(i18n.__('!'))
            .concat('\r\n').concat('Please feel free to try again!'));
    }

    async checkPermissions(message: Message): Promise<boolean> {
        return Promise.resolve(message.member && message.member.hasPermission('MANAGE_GUILD'));
    }
}
