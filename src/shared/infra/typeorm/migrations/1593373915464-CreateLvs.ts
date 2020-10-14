import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateLvs1593373915464 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'lvs',
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
            name: 'date_start',
            type: 'timestamp',
          },
          {
            name: 'date_end',
            type: 'timestamp',
          },
          {
            name: 'time_start',
            type: 'timestamp',
          },
          {
            name: 'time_end',
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
            name: 'task_type_id',
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
            isNullable: true,
          },
          {
            name: 'team_id',
            type: 'uuid',
          },
          {
            name: 'order_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'no_order',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'contractor_id',
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
            name: 'UserLv',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'ContractLv',
            referencedTableName: 'contracts',
            referencedColumnNames: ['id'],
            columnNames: ['contract_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'TaskStartLv',
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            columnNames: ['task_start_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'TaskEndLv',
            referencedTableName: 'tasks',
            referencedColumnNames: ['id'],
            columnNames: ['task_end_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'TaskTypeLv',
            referencedTableName: 'task_types',
            referencedColumnNames: ['id'],
            columnNames: ['task_type_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'UgrLv',
            referencedTableName: 'ugrs',
            referencedColumnNames: ['id'],
            columnNames: ['ugr_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'GroupLv',
            referencedTableName: 'groups',
            referencedColumnNames: ['id'],
            columnNames: ['group_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'TeamLv',
            referencedTableName: 'teams',
            referencedColumnNames: ['id'],
            columnNames: ['team_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'OrderLv',
            referencedTableName: 'orders',
            referencedColumnNames: ['id'],
            columnNames: ['order_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('lvs');
  }
}
