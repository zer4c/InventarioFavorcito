import { MigrationInterface, QueryRunner } from "typeorm";

export class NameColumnProductHistory1772074006874 implements MigrationInterface {
    name = 'NameColumnProductHistory1772074006874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_history" DROP COLUMN "NameChanged"`);
        await queryRunner.query(`ALTER TABLE "product_history" DROP COLUMN "IsActiveChanged"`);
        await queryRunner.query(`ALTER TABLE "product_history" DROP COLUMN "isDeletedChange"`);
        await queryRunner.query(`ALTER TABLE "product_history" ADD "nameChanged" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_history" ADD "isActiveChanged" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_history" ADD "isDeletedChanged" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "isActive" SET DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "isActive" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product_history" DROP COLUMN "isDeletedChanged"`);
        await queryRunner.query(`ALTER TABLE "product_history" DROP COLUMN "isActiveChanged"`);
        await queryRunner.query(`ALTER TABLE "product_history" DROP COLUMN "nameChanged"`);
        await queryRunner.query(`ALTER TABLE "product_history" ADD "isDeletedChange" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_history" ADD "IsActiveChanged" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_history" ADD "NameChanged" boolean NOT NULL`);
    }

}
