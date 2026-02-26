import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableOrderId1772120911786 implements MigrationInterface {
    name = 'NullableOrderId1772120911786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_history" DROP CONSTRAINT "FK_e3f593483fb86bd72080b676644"`);
        await queryRunner.query(`ALTER TABLE "inventory_history" ALTER COLUMN "orderId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_history" ADD CONSTRAINT "FK_e3f593483fb86bd72080b676644" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_history" DROP CONSTRAINT "FK_e3f593483fb86bd72080b676644"`);
        await queryRunner.query(`ALTER TABLE "inventory_history" ALTER COLUMN "orderId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_history" ADD CONSTRAINT "FK_e3f593483fb86bd72080b676644" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
