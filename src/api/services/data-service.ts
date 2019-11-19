import { Connection, Repository, EntitySchema } from 'typeorm';

export default interface DataService {
    instance: Connection;

    getRepository<T>(target: string | Function | (new () => T) | EntitySchema<T>): Repository<T>;
}