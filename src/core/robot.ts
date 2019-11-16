import i18n = require('i18n');
import { AppConfiguration, ModuleRegistry, Container, SERVICE_IDENTIFIERS, Lifecycle, DBConnection, ClientWrapper } from 'api';
import { createConnection } from 'typeorm';
import { Client } from 'discord.js';

export default class Robot implements Lifecycle {

    public moduleRegistry: ModuleRegistry;
    public configuration: AppConfiguration;
    public dbConnection: DBConnection;
    public client: ClientWrapper;

    public constructor() {
        this.moduleRegistry = Container.get<ModuleRegistry>(SERVICE_IDENTIFIERS.MODULE_REGISTRY);
        this.configuration = Container.get<AppConfiguration>(SERVICE_IDENTIFIERS.CONFIGURATION);
        this.dbConnection = Container.get<DBConnection>(SERVICE_IDENTIFIERS.DB_CONNECTION);
        this.client = Container.get<ClientWrapper>(SERVICE_IDENTIFIERS.CLIENT);
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
        this.client.client = new Client();

        await this.moduleRegistry.loadModules();
        return await this.moduleRegistry.preInitializeModules(this.client.client);
    }

    public async initialize(): Promise<void> {
        return await this.moduleRegistry.initializeModules(this.client.client);
    }

    public async postInitialize(): Promise<void> {
        return await this.moduleRegistry.postInitializeModules(this.client.client);
    }

    public async run(): Promise<void> {
        await this.client.client.login(this.configuration.token);
        return Promise.resolve();
    }
}