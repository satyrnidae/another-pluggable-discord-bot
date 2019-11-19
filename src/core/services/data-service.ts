import * as api from 'api';
import { Connection, EntitySchema, Repository, createConnection } from 'typeorm';
import { postConstruct } from 'inversify';

export default class DataService implements api.DataService {
    instance: Connection;

    @postConstruct()
    async postConstruct(): Promise<void> {
        this.instance = await createConnection();
    }

    getRepository<T>(target: string | Function | (new () => T) | EntitySchema<T>): Repository<T> {
        return this.instance.getRepository<T>(target);
    }
}