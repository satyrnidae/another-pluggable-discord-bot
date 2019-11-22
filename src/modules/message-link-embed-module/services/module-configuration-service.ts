import { readFileAsync } from 'api';
import { injectable } from 'inversify';

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

    private async loadConfig(): Promise<void> {
        if(!this.config) {
            const configurationData = await readFileAsync(MODULE_CONFIGURATION_PATH);
            this.config = JSON.parse(configurationData.toString()) as ModuleConfiguration;
        }
    }
}