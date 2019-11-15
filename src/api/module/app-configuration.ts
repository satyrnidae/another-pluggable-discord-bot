export default interface AppConfiguration {
    readonly token: string;
    readonly defaultPrefix: string;
    readonly defaultNickname: string;
    readonly showWelcomeMessage: boolean;
    readonly developerMode: boolean;
    readonly hearts: string[];
}