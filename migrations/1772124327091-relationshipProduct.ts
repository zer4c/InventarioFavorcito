import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationshipProduct1772124327091 implements MigrationInterface {
    name = 'RelationshipProduct1772124327091'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_history" DROP CONSTRAINT "FK_498472775bde5889db5a55b1c6c"`);
        await queryRunner.query(`ALTER TABLE "inventory_history" DROP CONSTRAINT "REL_498472775bde5889db5a55b1c6"`);
        await queryRunner.query(`ALTER TABLE "inventory_history" ADD CONSTRAINT "FK_498472775bde5889db5a55b1c6c" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_history" DROP CONSTRAINT "FK_498472775bde5889db5a55b1c6c"`);
        await queryRunner.query(`ALTER TABLE "inventory_history" ADD CONSTRAINT "REL_498472775bde5889db5a55b1c6" UNIQUE ("productId")`);
        await queryRunner.query(`ALTER TABLE "inventory_history" ADD CONSTRAINT "FK_498472775bde5889db5a55b1c6c" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
