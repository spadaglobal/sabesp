import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddLocationToLvs1598121781201
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'lvs',
      new TableColumn({
        name: 'location',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('lvs', 'location');
  }
}
