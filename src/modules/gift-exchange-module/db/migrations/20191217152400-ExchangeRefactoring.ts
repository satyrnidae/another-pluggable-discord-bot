import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExchangeRefactoring20191217152400 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('gex/Exchange', 'active', 'closed');
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameColumn('gex/Exchange', 'closed', 'active');
    }
}