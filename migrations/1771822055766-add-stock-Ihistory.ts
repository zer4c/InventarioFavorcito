import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStockIhistory1771822055766 implements MigrationInterface {
    name = 'AddStockIhistory1771822055766'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_history" ADD "stock" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_history" DROP COLUMN "stock"`);
    }

}
