import { DataEntityFactory, lazyInject, ServiceIdentifiers, DataService } from 'api';
import { UserLinkingPreferences } from 'modules/message-link-embed-module/db/entity';
import { User } from 'discord.js';
import { Repository } from 'typeorm';

export default class UserLinkingPreferencesFactory extends DataEntityFactory<UserLinkingPreferences> {
    @lazyInject(ServiceIdentifiers.Data)
    dataService: DataService;

    async load(user: User): Promise<UserLinkingPreferences> {
        if (!user) {
            return null;
        }

        const repository: Repository<UserLinkingPreferences> = await this.dataService.getRepository(UserLinkingPreferences);
        let preferences: UserLinkingPreferences = await repository.findOne({nativeId: user.id});

        if(!preferences) {
            preferences = new UserLinkingPreferences();
            preferences.linkingEnabled = true;
            preferences.nativeId = user.id;
            await preferences.save();
        }

        return preferences;
    }

}