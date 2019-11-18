import { DBConnection } from 'api';
import { Connection } from 'typeorm';
import { injectable } from 'inversify';

@injectable()
export default class DBConnectionBase implements DBConnection {
    instance: Connection;
}
