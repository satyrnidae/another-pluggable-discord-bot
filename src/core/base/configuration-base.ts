
import fs from 'fs';
import { injectable } from 'inversify';
import { AppConfiguration } from 'api';

@injectable()
export default class ConfigurationBase implements AppConfiguration {
    private wrappedInstance: AppConfiguration;
    private readonly configPath: string = `${__dirname}/../../../../config/config.json`;

    constructor() {
        this.wrappedInstance = JSON.parse(fs.readFileSync(this.configPath).toString()) as AppConfiguration;
    }

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
}
