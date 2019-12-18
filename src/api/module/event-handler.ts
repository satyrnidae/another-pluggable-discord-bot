/**
 * The base class for an event handler instance.
 */
export abstract class EventHandler {
    /**
     * The name of the event to handle.  See discord.js events for more details.
     */
    readonly abstract event: string;

    /**
     * @param moduleId The ID of the module to which this event belongs.
     */
    constructor(public readonly moduleId: string) { }

    /**
     * Handles the event.
     * @param args Any event arguments that were passed to this handler.
     */
    abstract async handler(...args: any[]): Promise<void>;
}
