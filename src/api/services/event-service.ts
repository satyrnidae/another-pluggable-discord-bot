import { EventHandler } from '/src/api/module';

/**
 * A service which allows event handlers to be registered to the client.
 */
export interface EventService {
    /**
     * Registers a new event handler to the client instance.
     * @param event The event handler to register.
     */
    registerEvent(event: EventHandler): void;

    /**
     * Adds a new listener function to the client instance
     * @param event The event to handle
     * @param listener The event handler function
     */
    addListener(event: string, listener: EventHandlerFunction): void;

    /**
     * Sets the event executor on an event on the client instance
     * @param event The event to handle
     * @param listener The event handler function
     */
    on(event: string, listener: Function): void;
}
