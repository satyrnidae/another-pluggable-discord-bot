import { DataEntity } from 'api/db';

export abstract class DataEntityFactory<T extends DataEntity> {
    abstract async load(...args: any[]): Promise<T>;
}
