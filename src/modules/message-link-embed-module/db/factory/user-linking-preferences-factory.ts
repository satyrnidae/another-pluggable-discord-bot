import { DataEntityFactory, lazyInject, ServiceIdentifiers, DataService } from 'api';
import { Repository } from 'typeorm';
import { UserLinkingPreferences } from '../entity';

export default class UserLinkingPreferencesFactory extends DataEntityFactory<UserLinkingPreferences> {
    @lazyInject(ServiceIdentifiers.Data)
    dataService: DataService;

    async load(nativeId: string): Promise<UserLinkingPreferences> {
        const repository: Repository<UserLinkingPreferences> = await this.dataService.getRepository(UserLinkingPreferences);
        let preferences: UserLinkingPreferences = await repository.findOne({nativeId});

        if(!preferences) {
            preferences = new UserLinkingPreferences();
            preferences.linkingEnabled = true;
            preferences.linkFromInactiveGuilds = true;
            preferences.linkToExternalGuilds = false;
            preferences.nativeId = nativeId;
            await preferences.save();
        }

        return preferences;
    }
}
