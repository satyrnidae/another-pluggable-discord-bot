declare module 'xmlhttprequest';

type Resolve<T> = (value?: T | PromiseLike<T>) => void;
type Reject = (reason?: any) => void;
type UnionArray<T> = T | T[];
