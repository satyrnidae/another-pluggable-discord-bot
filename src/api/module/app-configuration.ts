/**
 * Models an application configuration file.
 */
export interface AppConfiguration {
    /**
     * The bot user token with which to connect to Discord.
     */
    token: string;

    /**
     * The default command prefix for all guilds.
     */
    defaultPrefix: string;

    /**
     * The nickname that the bot will set on the initial server join.
     */
    defaultNickname: string;

    /**
     * Whether or not the welcome message should be sent when the bot joins a new guild.
     */
    showWelcomeMessage: boolean;

    /**
     * Whether or not the bot should be launched in developer mode, enabling more verbose logging.
     */
    developerMode: boolean;

    /**
     * A list of all the default randomized emoji that this bot instance should use.
     */
    hearts: string[];
}
