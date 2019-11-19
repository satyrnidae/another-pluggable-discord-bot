require('module-alias/register');
import * as api from 'api';
import * as core from 'core';

// Set Up Dependencies
api.Container.bind<api.CommandService>(api.ServiceIdentifiers.Command).to(core.CommandService).inSingletonScope();
api.Container.bind<api.ConfigurationService>(api.ServiceIdentifiers.Configuration).to(core.ConfigurationService).inSingletonScope();
api.Container.bind<api.ModuleService>(api.ServiceIdentifiers.Module).to(core.ModuleService).inSingletonScope();
api.Container.bind<api.DataService>(api.ServiceIdentifiers.Data).to(core.DataService).inSingletonScope();
api.Container.bind<api.ClientService>(api.ServiceIdentifiers.Client).to(core.ClientService).inSingletonScope();
api.Container.bind<api.EventService>(api.ServiceIdentifiers.Event).to(core.EventService).inSingletonScope();
api.Container.bind<api.Lifecycle>(core.Robot).toSelf().inSingletonScope();

const robot: api.Lifecycle = api.Container.resolve(core.Robot);

robot.preInitialize()
    .then(() => robot.initialize())
    .then(() => robot.postInitialize())
    .then(() => robot.run())
    .catch(reason => console.info(reason))
    .finally(() => {
        console.info('Service Started');
    });
