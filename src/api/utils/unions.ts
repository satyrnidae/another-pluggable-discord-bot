/**
 * Converts a union of a single object and an array of that object to an array
 * @param union The union array.
 */
export function unionToArray<T>(union: UnionArray<T>): T[] {
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
export function unionToInstance<T>(union: UnionArray<T>): T | undefined {
    if(union instanceof Array) {
        if(union.length === 1) {
            return union[0];
        }
        return undefined;
    }
    return union;
}

/**
 * Converts an array to null if empty, the single entry if length is one, or returns the array.
 * @param array The array to convert
 */
export function arrayToUnion<T>(array: T[]): UnionArray<T> | null {
    return array.length === 0 ? null : array.length === 1 ? array[0] : array;
}
