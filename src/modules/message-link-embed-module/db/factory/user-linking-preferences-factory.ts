import { DataEntityFactory, lazyInject, ServiceIdentifiers, DataService } from 'api';
import { UserLinkingPreferences } from 'modules/message-link-embed-module/db/entity';
import { User } from 'discord.js';
import { Repository } from 'typeorm';

export default class UserLinkingPreferencesFactory extends DataEntityFactory<UserLinkingPreferences> {
    @lazyInject(ServiceIdentifiers.Data)
    dataService: DataService;

    async load(query: string | User) {
        const userQuery: User = query as User;
        if(userQuery) {
            return this.loadByUser(userQuery);
        }
        return this.loadByNativeId(query as string);
    }

    private async loadByNativeId(nativeId: string): Promise<UserLinkingPreferences> {
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

    private async loadByUser(user: User): Promise<UserLinkingPreferences> {
        if (!user) {
            return null;
        }

        return this.loadByNativeId(user.id);
    }

}