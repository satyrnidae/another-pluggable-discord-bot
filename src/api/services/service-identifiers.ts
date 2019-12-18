/**
 * Symbols for all of the services which are available from the IOC container.
 */
const ServiceIdentifiers = {
    /**
     * Symbol for the configuration service
     */
    Configuration: Symbol.for('/src/api/services/configuration-service'),

    /**
     * Symbol for the client service
     */
    Client: Symbol.for('/src/api/services/client-service'),

    /**
     * Symbol for the command service
     */
    Command: Symbol.for('/src/api/services/command-service'),

    /**
     * Symbol for the data service
     */
    Data: Symbol.for('/src/api/services/data-service'),

    /**
     * Symbol for the event service
     */
    Event: Symbol.for('/src/api/services/event-service'),

    /**
     * Symbol for the module service
     */
    Module: Symbol.for('/src/api/services/module-service')
};

export { ServiceIdentifiers };
