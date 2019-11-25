import 'module-alias/register';
import * as sapi from 'api/services';
import { Container } from 'api/inversion';
import { Lifecycle } from 'api/lifecycle';
import Robot from 'core/robot';
import { CommandService, ConfigurationService, ModuleService, DataService, ClientService, EventService } from 'core/services';

// Set Up Dependencies
Container.bind<sapi.CommandService>(sapi.ServiceIdentifiers.Command).to(CommandService).inSingletonScope();
Container.bind<sapi.ConfigurationService>(sapi.ServiceIdentifiers.Configuration).to(ConfigurationService).inSingletonScope();
Container.bind<sapi.ModuleService>(sapi.ServiceIdentifiers.Module).to(ModuleService).inSingletonScope();
Container.bind<sapi.DataService>(sapi.ServiceIdentifiers.Data).to(DataService).inSingletonScope();
Container.bind<sapi.ClientService>(sapi.ServiceIdentifiers.Client).to(ClientService).inSingletonScope();
Container.bind<sapi.EventService>(sapi.ServiceIdentifiers.Event).to(EventService).inSingletonScope();
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
