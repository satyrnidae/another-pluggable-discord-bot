import { ModuleDetails } from '.';

export default interface ModuleInfo {
    name: string;
    version: string;
    id: string;
    authors: string[];
    details: ModuleDetails
}