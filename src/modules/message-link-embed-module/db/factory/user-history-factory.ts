import { DataEntityFactory } from 'api/db';
import { injectable, inject } from 'inversify';
import { ServiceIdentifiers, DataService } from 'api/services';
import { User } from 'discord.js';
import { UserHistory } from 'modules/message-link-embed-module/db/entity';

@injectable()
export class UserHistoryFactory implements DataEntityFactory<UserHistory> {
    constructor(@inject(ServiceIdentifiers.Data) private readonly dataService: DataService) {}

    async load(user: User): Promise<UserHistory> {
        const repository = await this.dataService.getRepository(UserHistory);
        let object = await repository.findOne({nativeId: user.id});
        if(!object) {
            object = new UserHistory();
            object.nativeId = user.id;
        }
        return object;
    }

}