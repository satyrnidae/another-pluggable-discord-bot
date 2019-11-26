import { DataEntityFactory } from 'api/db';
import { injectable, inject } from 'inversify';
import { ServiceIdentifiers, DataService } from 'api/services';
import { User } from 'discord.js';
import { UserSettings } from 'modules/message-link-embed-module/db/entity';

@injectable()
export class UserSettingsFactory implements DataEntityFactory<UserSettings> {
    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService) {}

    async load(user: User): Promise<UserSettings> {
        const repository = await this.dataService.getRepository(UserSettings);
        let object = await repository.findOne({nativeId: user.id});
        if(!object) {
            object = new UserSettings();
            object.nativeId = user.id;
            // Bots don't have privacy apparently
            if(user.bot) {
                object.linkFromDMs = true;
                object.linkFromNonPresent = true;
                object.linkToDMs = true;
                object.linkToNonPresent = true;
            }
        }
        object.name = user.username;
        return object;
    }

}