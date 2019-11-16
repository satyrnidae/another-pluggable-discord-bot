import i18n = require('i18n');
import { AppConfiguration, ModuleRegistry, Container, SERVICE_IDENTIFIERS, Lifecycle, DBConnection, ClientWrapper } from 'api';
import { createConnection } from 'typeorm';
import { Client } from 'discord.js';
import { injectable, inject } from 'inversify';

@injectable()
export default class Robot implements Lifecycle {

    public constructor(
        @inject(SERVICE_IDENTIFIERS.CLIENT) public client: ClientWrapper,
        @inject(SERVICE_IDENTIFIERS.DB_CONNECTION) public dbConnection: DBConnection,
        @inject(SERVICE_IDENTIFIERS.MODULE_REGISTRY) public moduleRegistry: ModuleRegistry) {}

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
        return await this.moduleRegistry.preInitializeModules();
    }

    public async initialize(): Promise<void> {
        return await this.moduleRegistry.initializeModules();
    }

    public async postInitialize(): Promise<void> {
        return await this.moduleRegistry.postInitializeModules();
    }

    public async run(): Promise<void> {
        await this.client.login();
        return Promise.resolve();
    }
}