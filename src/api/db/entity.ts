import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class DataEntity {
    abstract save(): Promise<this & DataEntity>;

    @CreateDateColumn()
    createDate: Date;

    @UpdateDateColumn()
    updateDate: Date;
}
