import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class ChangeLvIdToLvPos1602040718466
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'lvPos',
      new TableColumn({
        name: 'lv_id',
        type: 'uuid',
      }),
      new TableColumn({
        name: 'lv_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'lvPos',
      new TableColumn({
        name: 'lv_id',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'lv_id',
        type: 'uuid',
      }),
    );
  }
}
