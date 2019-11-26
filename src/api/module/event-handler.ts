export default abstract class EventHandler {
    readonly abstract event: string;

    constructor(public moduleId: string) {}

    abstract handler(...args: any[]): Promise<any>;
}
