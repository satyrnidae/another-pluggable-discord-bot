import * as i18n from 'i18n';
import { injectable } from 'inversify';
import { readFileAsync } from 'api/utils';

const MODULE_CONFIGURATION_PATH = `${__dirname}/../config/config.json`;

interface ModuleConfiguration {
    greetings: string[];
    gratitude: string[];
    sendLinkingErrorsToDMs: boolean;
}

@injectable()
export default class ModuleConfigurationService {

    private config: ModuleConfiguration;

    async getGreetings(): Promise<string[]> {
        await this.loadConfig();
        return this.config.greetings;
    }

    async getGratitude(): Promise<string[]> {
        await this.loadConfig();
        return this.config.gratitude;
    }

    async getSendLinkingErrorsToDMs(): Promise<boolean> {
        await this.loadConfig();
        return this.config.sendLinkingErrorsToDMs;
    }

    async getRandomGreeting(): Promise<string> {
        const greetings: string[] = await this.getGreetings();
        const randomIndex: number = Math.floor(Math.random() * greetings.length);
        return i18n.__(greetings[randomIndex]);
    }

    async getRandomGratitude(): Promise<string> {
        const gratitude: string[] = await this.getGratitude();
        const randomIndex: number = Math.floor(Math.random() * gratitude.length);
        return i18n.__(gratitude[randomIndex]);
    }

    private async loadConfig(): Promise<void> {
        if(!this.config) {
            const configurationData = await readFileAsync(MODULE_CONFIGURATION_PATH);
            this.config = JSON.parse(configurationData.toString()) as ModuleConfiguration;
        }
    }
}
