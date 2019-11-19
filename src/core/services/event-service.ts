import * as api from 'api';
import { inject, injectable } from 'inversify';
import { ServiceIdentifiers, ClientService, EventHandler } from 'api';

@injectable()
export default class EventService implements api.EventService {
    constructor(@inject(ServiceIdentifiers.Client) public clientService: ClientService) {}

    registerEvent(event: EventHandler): void {
        this.clientService.client.addListener(event.event, event.handler.bind(event));
    }

    addListener(event: string, listener: (...args: any[]) => void): void {
        this.clientService.client.addListener(event, listener);
    }

    on(event: string, listener: Function): void {
        this.clientService.client.on(event, listener);
    }
}
