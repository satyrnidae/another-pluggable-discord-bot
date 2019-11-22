export default class LoopStateArgs {
    continueExecution = true;

    break(): void {
        this.continueExecution = false;
    }
}
