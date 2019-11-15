require('module-alias/register');
import { Lifecycle, Container, CommandRegistry, SERVICE_IDENTIFIERS, AppConfiguration, ModuleRegistry, DBConnection } from 'api';
import { Robot, CommandRegistryBase, ConfigurationBase, ModuleRegistryBase, DBConnectionBase } from 'core';
import { Client } from 'discord.js';

// Set Up Dependencies
Container.bind<CommandRegistry>(SERVICE_IDENTIFIERS.COMMAND_REGISTRY).to(CommandRegistryBase).inSingletonScope();
Container.bind<AppConfiguration>(SERVICE_IDENTIFIERS.CONFIGURATION).to(ConfigurationBase).inSingletonScope();
Container.bind<ModuleRegistry>(SERVICE_IDENTIFIERS.MODULE_REGISTRY).to(ModuleRegistryBase).inSingletonScope();
Container.bind<DBConnection>(SERVICE_IDENTIFIERS.DB_CONNECTION).to(DBConnectionBase).inSingletonScope();

const client: Client = new Client();
const robot: Lifecycle = new Robot(client);

robot.preInitialize()
    .then(() => robot.initialize())
    .then(() => robot.postInitialize())
    .then(() => robot.run())
    .catch(reason => console.error(reason))
    .finally(async () => {
        console.log('Service Started');
    });
