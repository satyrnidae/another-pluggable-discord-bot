import * as api from 'api';
import { Connection, EntitySchema, Repository, createConnection } from 'typeorm';
import { postConstruct, injectable } from 'inversify';

@injectable()
export default class DataService implements api.DataService {
    instance: Connection;

    async getRepository<T>(target: string | Function | (new () => T) | EntitySchema<T>): Promise<Repository<T>> {
        if(!this.instance) {
            this.instance = await createConnection();
        }
        return this.instance.getRepository<T>(target);
    }
}
