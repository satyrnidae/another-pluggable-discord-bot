import { Connection } from 'typeorm';

export default interface DBConnection {
    instance: Connection;
}