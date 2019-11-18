export abstract class DBObject {
    abstract save(): Promise<this & DBObject>;
}
