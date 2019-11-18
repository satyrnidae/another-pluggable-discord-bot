export default abstract class DBObject {

    abstract save(): Promise<this & DBObject>;
}
