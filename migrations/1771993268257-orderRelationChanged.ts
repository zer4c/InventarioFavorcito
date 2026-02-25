import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderRelationChanged1771993268257 implements MigrationInterface {
    name = 'OrderRelationChanged1771993268257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_34ef3fc5a1a179b2cd87c74315a"`);
        await queryRunner.query(`ALTER TABLE "order" RENAME COLUMN "userID" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
        await queryRunner.query(`ALTER TABLE "order" RENAME COLUMN "userId" TO "userID"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_34ef3fc5a1a179b2cd87c74315a" FOREIGN KEY ("userID") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
