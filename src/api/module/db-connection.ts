import { Connection, Repository, EntitySchema } from 'typeorm';

export default interface DBConnection {
    instance: Connection;

    getRepository<T>(target: string | Function | (new () => T) | EntitySchema<T>): Repository<T>;
}
