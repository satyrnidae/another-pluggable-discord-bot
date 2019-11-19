require('module-alias/register');
import { Lifecycle, Container, CommandRegistry, SERVICE_IDENTIFIERS, AppConfiguration, ModuleRegistry, DBConnection, ClientWrapper, CommandService } from 'api';
import { Robot, CommandRegistryBase, ConfigurationBase, ModuleRegistryBase, DBConnectionBase, ClientWrapperBase, CommandServiceBase } from 'core';

// Set Up Dependencies
Container.bind<CommandRegistry>(SERVICE_IDENTIFIERS.COMMAND_REGISTRY).to(CommandRegistryBase).inSingletonScope();
Container.bind<AppConfiguration>(SERVICE_IDENTIFIERS.CONFIGURATION).to(ConfigurationBase).inSingletonScope();
Container.bind<ModuleRegistry>(SERVICE_IDENTIFIERS.MODULE_REGISTRY).to(ModuleRegistryBase).inSingletonScope();
Container.bind<DBConnection>(SERVICE_IDENTIFIERS.DB_CONNECTION).to(DBConnectionBase).inSingletonScope();
Container.bind<ClientWrapper>(SERVICE_IDENTIFIERS.CLIENT).to(ClientWrapperBase).inSingletonScope();

Container.bind<CommandService>(SERVICE_IDENTIFIERS.COMMAND_SERVICE).to(CommandServiceBase);

Container.bind<Lifecycle>(Robot).toSelf();

const robot: Lifecycle = Container.resolve(Robot);

robot.preInitialize()
    .then(() => robot.initialize())
    .then(() => robot.postInitialize())
    .then(() => robot.run())
    .catch(reason => console.error(reason))
    .finally(() => {
        console.info('Service Started');
    });
