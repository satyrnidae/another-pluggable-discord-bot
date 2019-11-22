import fs from 'fs';
import * as api from 'api';
import { injectable } from 'inversify';

const CONFIG_PATH = `${__dirname}/../../../../config/config.json`;

@injectable()
export default class ConfigurationService implements api.ConfigurationService {
    private config: api.AppConfiguration;

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
        return hearts[index];
    }

    private async loadConfig() {
        if(!this.config) {
            const configData: Buffer = await api.readFileAsync(CONFIG_PATH);
            this.config = JSON.parse(configData.toString()) as api.AppConfiguration;
        }
    }
}