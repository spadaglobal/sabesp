import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddTagToLvPos1602038395571 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'lvPos',
      new TableColumn({
        name: 'tag',
        type: 'int',
        isGenerated: true,
        generationStrategy: 'increment',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('lvPos', 'tag');
  }
}
