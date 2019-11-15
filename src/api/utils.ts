export async function forEachAsync(array: any[], callback: (current: any, index: number, array: any[]) => Promise<any>) {
    for(let index: number = 0; index < array.length; ++index) {
        await callback(array[index], index, array);
    }
}
