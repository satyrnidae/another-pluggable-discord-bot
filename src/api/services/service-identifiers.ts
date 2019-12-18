/**
 * Symbols for all of the services which are available from the IOC container.
 */
const ServiceIdentifiers = {
    /**
     * Symbol for the configuration service
     */
    Configuration: Symbol.for('/src/api/services/ConfigurationService'),

    /**
     * Symbol for the client service
     */
    Client: Symbol.for('/src/api/services/ClientService'),

    /**
     * Symbol for the command service
     */
    Command: Symbol.for('/src/api/services/CommandService'),

    /**
     * Symbol for the data service
     */
    Data: Symbol.for('/src/api/services/DataService'),

    /**
     * Symbol for the event service
     */
    Event: Symbol.for('/src/api/services/EventService'),

    /**
     * Symbol for the module service
     */
    Module: Symbol.for('/src/api/services/ModuleService')
};

export { ServiceIdentifiers };
