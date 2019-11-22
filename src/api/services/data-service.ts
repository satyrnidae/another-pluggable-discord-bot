import { Repository, EntitySchema } from 'typeorm';

export default interface DataService {
    getRepository<T>(target: string | Function | (new () => T) | EntitySchema<T>): Promise<Repository<T>>;
}
