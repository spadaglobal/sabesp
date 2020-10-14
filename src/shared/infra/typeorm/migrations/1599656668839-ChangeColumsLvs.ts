import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class ChangeColumsLvs1599656668839
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'lvs',
      new TableColumn({
        name: 'date_end',
        type: 'timestamp',
      }),
      new TableColumn({
        name: 'date_end',
        type: 'timestamp',
        isNullable: true,
      }),
    );
    await queryRunner.changeColumn(
      'lvs',
      new TableColumn({
        name: 'time_end',
        type: 'timestamp',
      }),
      new TableColumn({
        name: 'time_end',
        type: 'timestamp',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'lvs',
      new TableColumn({
        name: 'time_end',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'time_end',
        type: 'timestamp',
      }),
    );
    await queryRunner.changeColumn(
      'lvs',
      new TableColumn({
        name: 'date_end',
        type: 'timestamp',
        isNullable: true,
      }),
      new TableColumn({
        name: 'date_end',
        type: 'timestamp',
      }),
    );
  }
}
