import i18n = require('i18n');
import { Client } from 'discord.js';
import { CommandRegistry, Configuration } from '../api/entity';
import { ModuleRegistry } from '../api/modules';
import { Container, SERVICE_IDENTIFIERS } from '../api/inversion';


i18n.configure({
    locales: ['en'],
    fallbacks: {'*': 'en'},
    directory: `${__dirname}/locale`,
    logDebugFn: (msg) => console.debug(msg),
    logWarnFn: (msg) => console.warn(msg),
    logErrorFn: (msg) => console.error(msg)
});

var client = new Client();
var commandRegistry = Container.get<CommandRegistry>(SERVICE_IDENTIFIERS.COMMAND_REGISTRY);
var moduleRegistry = Container.get<ModuleRegistry>(SERVICE_IDENTIFIERS.MODULE_REGISTRY);
var configuration = Container.get<Configuration>(SERVICE_IDENTIFIERS.CONFIGURATION);

moduleRegistry.loadModules().then(modules => {
    moduleRegistry.initializeModules(client, modules);
    client.login(configuration.token)
});
