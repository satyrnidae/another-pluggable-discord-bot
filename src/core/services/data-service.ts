import * as sapi from 'api/services';
import { Connection, EntitySchema, Repository, createConnection } from 'typeorm';
import { injectable } from 'inversify';

@injectable()
export default class DataService implements sapi.DataService {
    instance: Connection;

    async getRepository<T>(target: string | Function | (new () => T) | EntitySchema<T>): Promise<Repository<T>> {
        if(!this.instance) {
            this.instance = await createConnection();
        }
        return this.instance.getRepository<T>(target);
    }
}
