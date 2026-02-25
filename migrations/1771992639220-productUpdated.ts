import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductUpdated1771992639220 implements MigrationInterface {
    name = 'ProductUpdated1771992639220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_history" DROP CONSTRAINT "FK_62d787c6cb6f6e6ec5351eba385"`);
        await queryRunner.query(`ALTER TABLE "inventory_history" RENAME COLUMN "OrderId" TO "orderId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "isDeleted" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product_history" ADD "isDeletedChange" boolean NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."order_state_enum" RENAME TO "order_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_state_enum" AS ENUM('queue', 'finished', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "state" TYPE "public"."order_state_enum" USING "state"::"text"::"public"."order_state_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "product_history" DROP CONSTRAINT "FK_ab858ab4b8711724b4cfafda6f1"`);
        await queryRunner.query(`ALTER TABLE "product_history" ALTER COLUMN "productId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_history" ADD CONSTRAINT "FK_ab858ab4b8711724b4cfafda6f1" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_history" ADD CONSTRAINT "FK_e3f593483fb86bd72080b676644" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_history" DROP CONSTRAINT "FK_e3f593483fb86bd72080b676644"`);
        await queryRunner.query(`ALTER TABLE "product_history" DROP CONSTRAINT "FK_ab858ab4b8711724b4cfafda6f1"`);
        await queryRunner.query(`ALTER TABLE "product_history" ALTER COLUMN "productId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_history" ADD CONSTRAINT "FK_ab858ab4b8711724b4cfafda6f1" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TYPE "public"."order_state_enum_old" AS ENUM('queue', 'finished', 'cancelles')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "state" TYPE "public"."order_state_enum_old" USING "state"::"text"::"public"."order_state_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."order_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_state_enum_old" RENAME TO "order_state_enum"`);
        await queryRunner.query(`ALTER TABLE "product_history" DROP COLUMN "isDeletedChange"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isDeleted"`);
        await queryRunner.query(`ALTER TABLE "inventory_history" RENAME COLUMN "orderId" TO "OrderId"`);
        await queryRunner.query(`ALTER TABLE "inventory_history" ADD CONSTRAINT "FK_62d787c6cb6f6e6ec5351eba385" FOREIGN KEY ("OrderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
