import * as i18n from 'i18n';
import { Options, Arguments } from 'yargs-parser';
import { Message } from 'discord.js';
import { Command } from '/src/api/module';
import { GuildConfiguration } from '/src/db/entity';
import { GuildConfigurationFactory } from '/src/db/factory';
import { lazyInject } from '/src/api/inversion';

export class SetPrefixCommand extends Command {
    friendlyName = i18n.__('Set Prefix');
    command = 'setprefix';
    syntax: string[] = ['setprefix [-p|--prefix] *prefix*'];
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

    @lazyInject(GuildConfigurationFactory)
    private readonly guildConfigurationFactory: GuildConfigurationFactory;

    async run(message: Message, args: Arguments): Promise<void> {
        if (!message.guild) {
            await message.reply(i18n.__('I\'m sorry, but I\'m afraid you can\'t change the prefix in a direct message!'));
            return;
        }

        const guildConfiguration: GuildConfiguration = await this.guildConfigurationFactory.load(message.guild);
        const prefix: string = args['prefix'] || args._[0];
        if (prefix && (prefix.match(/^[a-zA-Z0-9!$%^&+=]{1,5}$/) || message.member.hasPermission('ADMINISTRATOR'))) {
            guildConfiguration.commandPrefix = prefix;
            await guildConfiguration.save();
            await message.reply(i18n.__('Guild prefix successfully updated to "`%s`"!', guildConfiguration.commandPrefix));
        }
        else {
            await message.reply(i18n.__('Unfortunately, "`%s`" is not a valid prefix! ', prefix)
                .concat(i18n.__('Prefixes are any alphanumeric string less than six characters in length.')));
        }
    }

    async checkPermissions(message: Message): Promise<boolean> {
        return Promise.resolve(message.member && message.member.hasPermission('MANAGE_GUILD'));
    }
}
