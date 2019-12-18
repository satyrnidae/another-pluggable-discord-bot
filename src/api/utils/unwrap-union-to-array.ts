/**
 * Converts a union of a single object and an array of that object to an array
 * @param union The union array.
 */
export function unwrapUnionToArray<T>(union: UnionArray<T>): T[] {
    if(union instanceof Array) {
        return union;
    }
    return new Array(union);
}

/**
 * Convers a union of a single object and an array to a single instance of the object
 * @param union The union array.
 * @returns The single element, or undefined if multiple elements are present.
 */
export function unwrapUnionToSingle<T>(union: UnionArray<T>): T | undefined {
    if(union instanceof Array) {
        if(union.length === 1) {
            return union[0];
        }
        return undefined;
    }
    return union;
}
