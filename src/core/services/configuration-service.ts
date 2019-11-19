import fs from 'fs';
import * as api from 'api';
import { AppConfiguration } from 'api';

export default class ConfigurationService implements api.ConfigurationService {
    readonly wrappedInstance: AppConfiguration;
    //TODO: Resolve this hardcoded relative path somehow
    private readonly configPath: string = `${__dirname}/../../../../config/config.json`;

    get token(): string {
        return this.wrappedInstance.token;
    }
    get defaultPrefix(): string {
        return this.wrappedInstance.defaultPrefix;
    }
    get showWelcomeMessage(): boolean {
        return this.wrappedInstance.showWelcomeMessage;
    }
    get developerMode(): boolean {
        return this.wrappedInstance.developerMode;
    }
    get defaultNickname(): string {
        return this.wrappedInstance.defaultNickname;
    }
    get hearts(): string[] {
        return this.wrappedInstance.hearts;
    }

    constructor() {
        this.wrappedInstance = JSON.parse(fs.readFileSync(this.configPath).toString()) as AppConfiguration;
    }
}