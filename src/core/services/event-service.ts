import * as sapi from 'api/services';
import { inject, injectable } from 'inversify';
import { EventHandler } from 'api/module';

@injectable()
export default class EventService implements sapi.EventService {
    constructor(@inject(sapi.ServiceIdentifiers.Client) public clientService: sapi.ClientService) {}

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
