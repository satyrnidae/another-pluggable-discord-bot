import i18n = require('i18n');
import { Client } from 'discord.js';
import { Configuration, ModuleRegistry, Container, SERVICE_IDENTIFIERS, Lifecycle } from 'api';

export default class Robot implements Lifecycle {
    public moduleRegistry: ModuleRegistry;
    public configuration: Configuration;

    public constructor(public client: Client) {
        this.moduleRegistry = Container.get<ModuleRegistry>(SERVICE_IDENTIFIERS.MODULE_REGISTRY);
        this.configuration = Container.get<Configuration>(SERVICE_IDENTIFIERS.CONFIGURATION);
    }

    public async preInitialize(): Promise<void> {
        i18n.configure({
            locales: ['en'],
            fallbacks: {'*': 'en'},
            directory: `${__dirname}/locale`,
            logDebugFn: (msg) => console.debug(msg),
            logWarnFn: (msg) => console.warn(msg),
            logErrorFn: (msg) => console.error(msg)
        });
        i18n.setLocale('en');

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