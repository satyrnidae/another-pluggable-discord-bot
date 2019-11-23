export function unwrapUnionToArray<T>(union: UnionArray<T>): T[] {
    if(union instanceof Array) {
        return union;
    }
    return new Array(union);
}
