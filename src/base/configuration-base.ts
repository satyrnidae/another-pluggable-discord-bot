
import fs from 'fs';
import { injectable } from 'inversify';
import { Configuration } from '../../api/entity';

@injectable()
export default class ConfigurationBase implements Configuration {
    wrappedInstance: Configuration;

    constructor() {
        this.wrappedInstance = <Configuration>JSON.parse(fs.readFileSync(`${__dirname}/../../config/config.json`).toString());
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
}
