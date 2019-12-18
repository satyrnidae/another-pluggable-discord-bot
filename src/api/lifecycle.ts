/**
 * Main app lifecycle interface
 */
export interface Lifecycle {
    /**
     * The pre-initialization stage
     */
    preInitialize(): Promise<void>;

    /**
     * The initialization stage
     */
    initialize(): Promise<void>;

    /**
     * The post-initialization stage
     */
    postInitialize(): Promise<void>;

    /**
     * The main run method
     */
    run(): Promise<void>;
}
