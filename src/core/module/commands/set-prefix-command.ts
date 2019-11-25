import * as i18n from 'i18n';
import { Options, Arguments } from 'yargs-parser';
import { Message } from 'discord.js';
import { Command } from 'api/module';
import { GuildConfiguration } from 'db/entity';
import { GuildConfigurationFactory } from 'db/factory';

export default class SetPrefixCommand extends Command {
    name = 'setPrefix';
    command = 'setPrefix';
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
    };

    async run(message: Message, args: Arguments): Promise<any> {
        if (!message.guild) {
            message.reply(i18n.__('I\'m sorry, but I\'m afraid you can\'t change the prefix in a direct message!'));
        }

        const guildConfiguration: GuildConfiguration = await new GuildConfigurationFactory().load(message.guild);
        const prefix: string = args['prefix'] || args._[0];
        if (prefix) {
            guildConfiguration.commandPrefix = prefix;
            await guildConfiguration.save();
            return message.reply(i18n.__('Guild prefix successfully updated to "`%s`"!', guildConfiguration.commandPrefix));
        }
        return message.reply(i18n.__('Unfortunately, "`%s`" is not a valid prefix! Please try again with a valid prefix.', prefix));
    }

    async checkPermissions(message: Message): Promise<boolean> {
        return Promise.resolve(message.member && message.member.hasPermission('MANAGE_GUILD'));
    }
}
