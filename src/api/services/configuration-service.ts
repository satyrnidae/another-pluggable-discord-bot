import { AppConfiguration } from 'api';

export default interface ConfigurationService {
    readonly token: string;
    readonly defaultPrefix: string;
    readonly defaultNickname: string;
    readonly showWelcomeMessage: boolean;
    readonly developerMode: boolean;
    readonly hearts: string[];
    readonly wrappedInstance: AppConfiguration;
}