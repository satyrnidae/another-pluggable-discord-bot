import { DataEntity } from 'api';

export default abstract class DataEntityFactory<T extends DataEntity> {
    abstract async load(...args: any[]): Promise<T>;
}
