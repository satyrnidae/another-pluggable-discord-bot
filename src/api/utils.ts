export class LoopStateArgs {
    break: boolean;
}

export async function forEachAsync(array: any[], callback: (current: any, index: number, array: any[], loopStateArgs: LoopStateArgs) => Promise<any>) {
    const loopStateArgs: LoopStateArgs = new LoopStateArgs();

    for(let index: number = 0; index < array.length; ++index) {
        await callback(array[index], index, array, loopStateArgs);
        if(loopStateArgs.break) break;
    }
}
