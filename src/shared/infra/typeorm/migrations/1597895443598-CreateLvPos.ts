import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateLvPos1597895443598 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'lvPos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'contract_id',
            type: 'uuid',
          },
          {
            name: 'date',
            type: 'timestamp',
          },
          {
            name: 'time',
            type: 'timestamp',
          },
          {
            name: 'task_start_id',
            type: 'uuid',
          },
          {
            name: 'task_end_id',
            type: 'uuid',
          },
          {
            name: 'ugr_id',
            type: 'uuid',
          },
          {
            name: 'group_id',
            type: 'uuid',
          },
          {
            name: 'address',
            type: 'varchar',
          },
          {
            name: 'badge_solo',
            type: 'varchar',
          },
          {
            name: 'badge_capa',
            type: 'varchar',
          },
          {
            name: 'location',
            type: 'varchar',
          },
          {
            name: 'contractor_id',
            type: 'uuid',
          },
          {
            name: 'lv_id',
            type: 'uuid',
          },
          {
            name: 'observation_first',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'observation_second',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'observation_third',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'observation_fourth',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'LvLvPos',
            referencedTableName: 'lvs',
            referencedColumnNames: ['id'],
            columnNames: ['lv_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'UserLvPos',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ContractLvPos',
            referencedTableName: 'contracts',
            referencedColumnNames: ['id'],
            columnNames: ['contract_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'TaskStartLvPos',
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            columnNames: ['task_start_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'TaskEndLvPos',
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            columnNames: ['task_end_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'UgrLvPos',
            referencedTableName: 'ugrs',
            referencedColumnNames: ['id'],
            columnNames: ['ugr_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'GroupLvPos',
            referencedTableName: 'groups',
            referencedColumnNames: ['id'],
            columnNames: ['group_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('lvPos');
  }
}
