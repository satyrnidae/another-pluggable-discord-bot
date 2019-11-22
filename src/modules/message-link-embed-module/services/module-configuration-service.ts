import * as fs from 'fs';
import { injectable } from 'inversify';

const MODULE_CONFIGURATION_PATH = `${__dirname}/../config/config.json`;

interface ModuleConfiguration {
    greetings: string[];
    gratitude: string[];
    sendLinkingErrorsToDMs: boolean;
}

@injectable()
export default class ModuleConfigurationService {

    private instance: ModuleConfiguration;

    constructor() {
        this.instance = JSON.parse(fs.readFileSync(MODULE_CONFIGURATION_PATH).toString()) as ModuleConfiguration;
    }

    get greetings(): string[] {
        return this.instance.greetings;
    }

    get gratitude(): string[] {
        return this.instance.gratitude;
    }

    get sendLinkingErrorsToDMs(): boolean {
        return this.instance.sendLinkingErrorsToDMs;
    }
}