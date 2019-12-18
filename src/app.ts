import { Container } from '/src/api/inversion';
import { Lifecycle } from '/src/api/lifecycle';
import {
    CommandService as ICommandService, ConfigurationService as IConfigurationService, ModuleService as IModuleService, DataService as IDataService,
    ClientService as IClientService, EventService as IEventService, ServiceIdentifiers
} from '/src/api/services';
import { GuildConfigurationFactory } from '/src/db/factory';
import { CommandService, ConfigurationService, DataService, ClientService, EventService, ModuleService } from '/src/core/services';
import { Robot } from '/src/core/robot';

// Set Up Dependencies
Container.bind<ICommandService>(ServiceIdentifiers.Command).to(CommandService).inSingletonScope();
Container.bind<IConfigurationService>(ServiceIdentifiers.Configuration).to(ConfigurationService).inSingletonScope();
Container.bind<IModuleService>(ServiceIdentifiers.Module).to(ModuleService).inSingletonScope();
Container.bind<IDataService>(ServiceIdentifiers.Data).to(DataService).inSingletonScope();
Container.bind<IClientService>(ServiceIdentifiers.Client).to(ClientService).inSingletonScope();
Container.bind<IEventService>(ServiceIdentifiers.Event).to(EventService).inSingletonScope();
Container.bind<GuildConfigurationFactory>(GuildConfigurationFactory).toSelf();
Container.bind<Lifecycle>(Robot).toSelf().inSingletonScope();

const robot: Lifecycle = Container.resolve(Robot);
robot.preInitialize()
    .then(() => robot.initialize())
    .then(() => robot.postInitialize())
    .then(() => robot.run())
    .catch(reason => console.info(reason))
    .finally(() => {
        console.info('Service Started');
    });
