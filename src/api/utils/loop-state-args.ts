export default class LoopStateArgs {
    continueExecution: boolean = true;

    break(): void {
        this.continueExecution = false;
    }
}
