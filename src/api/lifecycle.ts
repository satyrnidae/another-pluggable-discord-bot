export interface Lifecycle {
    preInitialize(): Promise<void>;
    initialize(): Promise<void>;
    postInitialize(): Promise<void>;
    run(): Promise<void>;
}
