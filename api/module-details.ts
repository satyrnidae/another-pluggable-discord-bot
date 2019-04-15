export default interface ModuleDetails {
    language: Language;
    apiVersion: string;
    entryPoint: string;
}

export enum Language {
    TypeScript,
    JavaScript
}