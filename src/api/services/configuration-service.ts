/**
 * A service which provides access to the main configuration settings.
 */
export interface ConfigurationService {
    /**
     * Gets the Discord api token.
     */
    getToken(): Promise<string>;

    /**
     * Gets the default command prefix.
     */
    getDefaultPrefix(): Promise<string>;

    /**
     * Gets the nickname which the bot will set on initial guild join.
     */
    getDefaultNickname(): Promise<string>;

    /**
     * Gets a list of emoji names which the bot can randomly choose.
     */
    getHearts(): Promise<string[]>;

    /**
     * Gets a flag indicating whether or not the guild introductory message should be shown on initial guild join.
     */
    shouldShowWelcomeMessage(): Promise<boolean>;

    /**
     * Gets a flag indicating whether or not the bot is running in development mode.
     */
    isDeveloperMode(): Promise<boolean>;

    /**
     * Gets a single random emoji name from the list of random emoji names.
     */
    getRandomHeart(): Promise<string>;
}
