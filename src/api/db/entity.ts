export abstract class DataEntity {
    abstract save(): Promise<this & DataEntity>;
}
