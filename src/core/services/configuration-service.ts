import * as sapi from 'api/services';
import { injectable } from 'inversify';
import { AppConfiguration } from 'api/module';
import { readFileAsync } from 'api/utils';

const CONFIG_PATH = `${__dirname}/../../../../config/config.json`;

@injectable()
export default class ConfigurationService implements sapi.ConfigurationService {
    private config: AppConfiguration;

    async getToken(): Promise<string> {
        await this.loadConfig();
        return this.config.token;
    }

    async getDefaultPrefix(): Promise<string> {
        await this.loadConfig();
        return this.config.defaultPrefix;
    }

    async getDefaultNickname(): Promise<string> {
        await this.loadConfig();
        return this.config.defaultNickname;
    }

    async getHearts(): Promise<string[]> {
        await this.loadConfig();
        return this.config.hearts;
    }

    async shouldShowWelcomeMessage(): Promise<boolean> {
        await this.loadConfig();
        return this.config.showWelcomeMessage;
    }

    async isDeveloperMode(): Promise<boolean> {
        await this.loadConfig();
        return this.config.developerMode;
    }

    async getRandomHeart(): Promise<string> {
        const hearts: string[] = await this.getHearts();
        const index: number = Math.floor(Math.random() * hearts.length);
        return `:${hearts[index]}:`;
    }

    private async loadConfig() {
        if(!this.config) {
            const configData: Buffer = await readFileAsync(CONFIG_PATH);
            this.config = JSON.parse(configData.toString()) as AppConfiguration;
        }
    }
}
