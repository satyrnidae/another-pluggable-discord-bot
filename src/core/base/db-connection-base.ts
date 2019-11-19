import { DBConnection } from 'api';
import { Connection, createConnection, Repository, EntitySchema } from 'typeorm';
import { injectable, postConstruct } from 'inversify';

@injectable()
export default class DBConnectionBase implements DBConnection {
    instance: Connection;

    @postConstruct()
    async postConstruct(): Promise<void> {
        this.instance = await createConnection();
    }

    getRepository<T>(target: string | Function | (new () => T) | EntitySchema<T>): Repository<T> {
        return this.instance.getRepository<T>(target);
    }
}
