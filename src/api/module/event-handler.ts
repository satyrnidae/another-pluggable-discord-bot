export default abstract class EventHandler {
    readonly abstract event: string;

    abstract handler(...args: any[]): Promise<any>;
}
