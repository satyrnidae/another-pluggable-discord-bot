declare module 'xmlhttprequest';

type EventHandlerFunction = (...args: any[]) => void;
type RepositoryTarget<T> = string | Function | (new () => T) | import('typeorm').EntitySchema<T>;
type Resolve<T> = (value?: T | PromiseLike<T>) => void;
type Reject = (reason?: any) => void;
type UnionArray<T> = T | T[];
