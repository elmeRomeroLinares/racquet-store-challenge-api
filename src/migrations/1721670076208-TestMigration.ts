import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestMigration1721670076208 implements MigrationInterface {
  name = 'TestMigration1721670076208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Clean up duplicates
    await queryRunner.query(`
                    WITH duplicates AS (
                        SELECT 
                            id,
                            ROW_NUMBER() OVER (PARTITION BY username ORDER BY id) AS rnum
                        FROM 
                            "user"
                    )
                    DELETE FROM "user"
                    WHERE id IN (
                        SELECT id
                        FROM duplicates
                        WHERE rnum > 1
                    );
                `);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`,
    );
  }
}
