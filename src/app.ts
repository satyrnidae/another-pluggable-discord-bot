require('module-alias/register');
import { Lifecycle, Container, CommandRegistry, SERVICE_IDENTIFIERS, Configuration, ModuleRegistry } from 'api';
import { Robot, CommandRegistryBase, ConfigurationBase, ModuleRegistryBase } from 'core';
import { Client } from 'discord.js';

// Set Up Dependencies
Container.bind<CommandRegistry>(SERVICE_IDENTIFIERS.COMMAND_REGISTRY).to(CommandRegistryBase).inSingletonScope();
Container.bind<Configuration>(SERVICE_IDENTIFIERS.CONFIGURATION).to(ConfigurationBase).inSingletonScope();
Container.bind<ModuleRegistry>(SERVICE_IDENTIFIERS.MODULE_REGISTRY).to(ModuleRegistryBase).inSingletonScope();

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
