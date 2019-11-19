import { EventHandler } from 'api';

export default interface EventService {
    registerEvent(event: EventHandler): void;
    addListener(event: string, listener: (...args: any[]) => void): void;
    on(event: string, listener: Function): void;
}