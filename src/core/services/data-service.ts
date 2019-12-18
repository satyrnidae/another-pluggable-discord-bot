import { Connection, Repository, createConnection } from 'typeorm';
import { injectable } from 'inversify';
import { DataService as IDataService } from '/src/api/services';

@injectable()
export class DataService implements IDataService {
    private connection: Connection;

    async getRepository<T>(target: RepositoryTarget<T>): Promise<Repository<T>> {
        if(!this.connection) {
            this.connection = await createConnection();
        }
        return this.connection.getRepository<T>(target);
    }
}
