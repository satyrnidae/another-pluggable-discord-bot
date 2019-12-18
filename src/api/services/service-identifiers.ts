/**
 * Symbols for all of the services which are available from the IOC container.
 */
const ServiceIdentifiers = {
    Configuration: Symbol.for('/src/api/services/ConfigurationService'),
    Client: Symbol.for('/src/api/services/ClientService'),
    Command: Symbol.for('/src/api/services/CommandService'),
    Data: Symbol.for('/src/api/services/DataService'),
    Event: Symbol.for('/src/api/services/EventService'),
    Module: Symbol.for('/src/api/services/ModuleService')
};

export { ServiceIdentifiers };
