export default interface ConfigurationService {
    getToken(): Promise<string>;
    getDefaultPrefix(): Promise<string>;
    getDefaultNickname(): Promise<string>;
    getHearts(): Promise<string[]>;
    shouldShowWelcomeMessage(): Promise<boolean>;
    isDeveloperMode(): Promise<boolean>;
    getRandomHeart(): Promise<string>;
}
