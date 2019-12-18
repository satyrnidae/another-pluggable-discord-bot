/**
 * Asynchronous loop state control
 */
export class LoopStateArgs {
    private _continueExecution = true;

    /**
     * Gets a flag inidicating whether execution should continue for this loop.
     */
    get continueExecution() {
        return this._continueExecution;
    }

    /**
     * Causes the loop to exit after processing for this item is complete.
     */
    break(): void {
        this._continueExecution = false;
    }
}
