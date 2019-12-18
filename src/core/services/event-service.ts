
import { inject, injectable } from 'inversify';
import { EventHandler } from '/src/api/module';
import { EventService as IEventService, ClientService as IClientService, ServiceIdentifiers } from '/src/api/services';

@injectable()
export class EventService implements IEventService {
    /**
     * @param clientService The injected client service instance
     */
    constructor(@inject(ServiceIdentifiers.Client) private readonly clientService: IClientService) {}

    registerEvent(event: EventHandler): void {
        this.clientService.client.addListener(event.event, event.handler.bind(event));
    }

    addListener(event: string, listener: EventHandlerFunction): void {
        this.clientService.client.addListener(event, listener);
    }

    on(event: string, listener: Function): void {
        this.clientService.client.on(event, listener);
    }
}
