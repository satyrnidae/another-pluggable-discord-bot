
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

    set token(token: string) {
        this.wrappedInstance.token = token;
    }

    get defaultPrefix(): string {
        return this.wrappedInstance.defaultPrefix;
    }

    set defaultPrefix(defaultPrefix: string) {
        this.wrappedInstance.defaultPrefix = defaultPrefix;
    }

    get welcomeMessage(): boolean {
        return this.wrappedInstance.welcomeMessage;
    }

    set welcomeMessage(welcomeMessage: boolean) {
        this.wrappedInstance.welcomeMessage = welcomeMessage;
    }

    get developerMode(): boolean {
        return this.wrappedInstance.developerMode;
    }

    set developerMode(developerMode: boolean) {
        this.wrappedInstance.developerMode = developerMode;
    }

    get defaultNickname(): string {
        return this.wrappedInstance.defaultNickname;
    }

    set defaultNickname(value: string) {
        this.wrappedInstance.defaultNickname = value;
    }
}
