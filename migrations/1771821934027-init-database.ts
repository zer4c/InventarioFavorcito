import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1771821934027 implements MigrationInterface {
    name = 'InitDatabase1771821934027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "role" "public"."user_role_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_state_enum" AS ENUM('queue', 'finished', 'cancelles')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "state" "public"."order_state_enum" NOT NULL, "clientName" character varying NOT NULL, "address" character varying NOT NULL, "stockRequired" integer NOT NULL, "userID" integer, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isActive" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_22cc43e9a74d7498546e9a63e77" UNIQUE ("name"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_history" ("id" SERIAL NOT NULL, "NameChanged" boolean NOT NULL, "IsActiveChanged" boolean NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "productId" integer, CONSTRAINT "PK_235f5de8f3f653973711bc77b16" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" SERIAL NOT NULL, "stock" integer NOT NULL, "productId" integer, CONSTRAINT "REL_c8622e1e24c6d054d36e882449" UNIQUE ("productId"), CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_history" ("id" SERIAL NOT NULL, "isOut" boolean NOT NULL, "productId" integer, "OrderId" integer, CONSTRAINT "REL_498472775bde5889db5a55b1c6" UNIQUE ("productId"), CONSTRAINT "REL_62d787c6cb6f6e6ec5351eba38" UNIQUE ("OrderId"), CONSTRAINT "PK_1024f12ca5be1b97424c1c4b48f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_34ef3fc5a1a179b2cd87c74315a" FOREIGN KEY ("userID") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_history" ADD CONSTRAINT "FK_ab858ab4b8711724b4cfafda6f1" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_c8622e1e24c6d054d36e8824490" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_history" ADD CONSTRAINT "FK_498472775bde5889db5a55b1c6c" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_history" ADD CONSTRAINT "FK_62d787c6cb6f6e6ec5351eba385" FOREIGN KEY ("OrderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_history" DROP CONSTRAINT "FK_62d787c6cb6f6e6ec5351eba385"`);
        await queryRunner.query(`ALTER TABLE "inventory_history" DROP CONSTRAINT "FK_498472775bde5889db5a55b1c6c"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_c8622e1e24c6d054d36e8824490"`);
        await queryRunner.query(`ALTER TABLE "product_history" DROP CONSTRAINT "FK_ab858ab4b8711724b4cfafda6f1"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_34ef3fc5a1a179b2cd87c74315a"`);
        await queryRunner.query(`DROP TABLE "inventory_history"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "product_history"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_state_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
