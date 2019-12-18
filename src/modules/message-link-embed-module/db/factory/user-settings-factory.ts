import { injectable, inject } from 'inversify';
import { User } from 'discord.js';
import { DataEntityFactory } from '/src/api/db';
import { ServiceIdentifiers, DataService } from '/src/api/services';
import { UserSettings } from '/src/modules/message-link-embed-module/db/entity';

@injectable()
export class UserSettingsFactory implements DataEntityFactory<UserSettings> {
    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService) {}

    async load(user: User): Promise<UserSettings> {
        const repository = await this.dataService.getRepository(UserSettings);
        let userSettings = await repository.findOne({nativeId: user.id});
        if(!userSettings) {
            userSettings = new UserSettings();
            userSettings.nativeId = user.id;
            // Bots don't have privacy apparently
            if(user.bot) {
                userSettings.linkFromDMs = true;
                userSettings.linkFromNonPresent = true;
                userSettings.linkToDMs = true;
                userSettings.linkToNonPresent = true;
            }
        }
        userSettings.name = user.username;
        return userSettings;
    }
}
