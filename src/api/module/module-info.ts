import { ModuleDetails } from '/src/api/module/module-details';

/**
 * Models the basic module info file.
 */
export interface ModuleInfo {
    /**
     * The friendly name of the module
     */
    name: string;

    /**
     * The module's version
     */
    version: string;

    /**
     * The module's unique ID
     */
    id: string;

    /**
     * Additional details about the module
     */
    details: ModuleDetails
}
