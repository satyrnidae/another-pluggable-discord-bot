import { Message } from 'discord.js';
import { EventHandler } from '/src/api/module';

/**
 * Skeleton implementation for an event handler which handles message events.
 */
export abstract class MessageEventHandler extends EventHandler {
    /**
     * The message event name.
     */
    readonly event: string = 'message';

    /**
     * @param moduleId The ID of the module to which this event belongs.
     */
    constructor(moduleId: string) {
        super(moduleId);
    }

    /**
     * @param message The message which fired the event.
     */
    abstract async handler(message: Message): Promise<void>;
}
