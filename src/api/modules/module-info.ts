import ModuleDetails from 'api/modules/module-details';

export default interface ModuleInfo {
    name: string;
    version: string;
    id: string;
    authors: string[];
    details: ModuleDetails
}