import { Repository } from 'typeorm';

/**
 * A service which provides access to the data source.
 */
export interface DataService {
    /**
     * Gets a new repository instance for a specific target.
     * @param target The target for which the repository is resolved.
     */
    getRepository<T>(target: RepositoryTarget<T>): Promise<Repository<T>>;
}
