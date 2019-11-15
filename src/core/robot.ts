import i18n = require('i18n');
import { Client } from 'discord.js';
import { AppConfiguration, ModuleRegistry, Container, SERVICE_IDENTIFIERS, Lifecycle, DBConnection } from 'api';
import { inject } from 'inversify';
import { createConnection } from 'typeorm';

export default class Robot implements Lifecycle {

    public moduleRegistry: ModuleRegistry;
    public configuration: AppConfiguration;
    public dbConnection: DBConnection;

    public constructor(public client: Client) {
        this.moduleRegistry = Container.get<ModuleRegistry>(SERVICE_IDENTIFIERS.MODULE_REGISTRY);
        this.configuration = Container.get<AppConfiguration>(SERVICE_IDENTIFIERS.CONFIGURATION);
        this.dbConnection = Container.get<DBConnection>(SERVICE_IDENTIFIERS.DB_CONNECTION);
    }

    public async preInitialize(): Promise<void> {
        i18n.configure({
            locales: ['en'],
            fallbacks: {'*': 'en'},
            directory: `${__dirname}/locale`,
            logWarnFn: (msg) => console.warn(msg),
            logErrorFn: (msg) => console.error(msg)
        });
        i18n.setLocale('en');

        this.dbConnection.instance = await createConnection();

        await this.moduleRegistry.loadModules();
        return await this.moduleRegistry.preInitializeModules(this.client);
    }

    public async initialize(): Promise<void> {
        return await this.moduleRegistry.initializeModules(this.client);
    }

    public async postInitialize(): Promise<void> {
        return await this.moduleRegistry.postInitializeModules(this.client);
    }

    public async run(): Promise<void> {
        await this.client.login(this.configuration.token);
        return Promise.resolve();
    }
}