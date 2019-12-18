/**
 * Represents detailed module information.
 */
export interface ModuleDetails {
    /**
     * The API version which this module targets.
     */
    apiVersion: string;

    /**
     * The module entry point.
     */
    entryPoint: string;

    /**
     * The authors involved in the creation of this module.
     */
    authors: string[];

    /**
     * The module description.
     */
    description: string;

    /**
     * The website for the module.
     */
    website: string;
}
