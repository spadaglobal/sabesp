import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddTagToLvs1599660259195 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'lvs',
      new TableColumn({
        name: 'tag',
        type: 'int',
        isGenerated: true,
        generationStrategy: 'increment',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('lvs', 'tag');
  }
}
