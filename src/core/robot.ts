import i18n = require('i18n');
import { Lifecycle, ModuleService, ClientService, ServiceIdentifiers } from 'api';
import { injectable, inject } from 'inversify';

@injectable()
export default class Robot implements Lifecycle {

    public constructor(
        @inject(ServiceIdentifiers.Client) public clientService: ClientService,
        @inject(ServiceIdentifiers.Module) public moduleService: ModuleService) {}

    public async preInitialize(): Promise<void> {
        i18n.configure({
            locales: ['en'],
            fallbacks: {'*': 'en'},
            directory: `${__dirname}/locale`,
            logWarnFn: (msg) => console.info(msg),
            logErrorFn: (msg) => console.info(msg)
        });
        i18n.setLocale('en');

        await this.moduleService.loadModules();
        await this.moduleService.registerDependencies();
        return this.moduleService.preInitializeModules();
    }

    public async initialize(): Promise<void> {
        return this.moduleService.initializeModules();
    }

    public async postInitialize(): Promise<void> {
        return this.moduleService.postInitializeModules();
    }

    public async run(): Promise<void> {
        await this.clientService.login();
        return Promise.resolve();
    }
}
