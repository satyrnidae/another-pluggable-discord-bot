import { Client, Guild, User } from 'discord.js';

/**
 * A service which provides access to a single client instance.
 */
export interface ClientService {
    /**
     * The client instance.
     */
    readonly client: Client;

    /**
     * The guilds present on the client.
     */
    readonly guilds: Guild[];

    /**
     * The logged-in user in the client.
     */
    readonly user: User;

    /**
     * Connects the client instance to Discord with the token provided in the app configuration.
     */
    login(): Promise<string>;

    /**
     * Returns the logged-in user's display name for a given guild, or the username.
     * @param guild Optionally, the guild with which to determine the display name.
     */
    getDisplayName(guild?: Guild): string;
}
