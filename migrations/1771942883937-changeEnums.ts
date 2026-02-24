import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeEnums1771942883937 implements MigrationInterface {
    name = 'ChangeEnums1771942883937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."order_state_enum" RENAME TO "order_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."order_state_enum" AS ENUM('queue', 'finished', 'cancelled')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "state" TYPE "public"."order_state_enum" USING "state"::"text"::"public"."order_state_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_state_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."order_state_enum_old" AS ENUM('queue', 'finished', 'cancelles')`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "state" TYPE "public"."order_state_enum_old" USING "state"::"text"::"public"."order_state_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."order_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."order_state_enum_old" RENAME TO "order_state_enum"`);
    }

}
