import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class ChangeObservationColumnReviews1601822728239
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'reviews',
      new TableColumn({
        name: 'observation',
        type: 'varchar',
      }),
      new TableColumn({
        name: 'observation',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'reviews',
      new TableColumn({
        name: 'observation',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'observation',
        type: 'varchar',
      }),
    );
  }
}
