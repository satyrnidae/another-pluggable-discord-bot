export default abstract class DataEntity {
    abstract save(): Promise<this & DataEntity>;
}
