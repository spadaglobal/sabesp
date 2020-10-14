import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateRequirements1597895501997
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'requirements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'parent_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'requirementsId',
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
            name: 'RequirementFather',
            referencedTableName: 'requirements',
            referencedColumnNames: ['id'],
            columnNames: ['parent_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'requirements_lv_pos_lv_pos',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'requirementsId',
            type: 'uuid',
          },
          {
            name: 'lvPosId',
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
            name: 'RequirementLvPos',
            referencedTableName: 'requirements',
            referencedColumnNames: ['id'],
            columnNames: ['requirementsId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'LvPosRequirement',
            referencedTableName: 'lvPos',
            referencedColumnNames: ['id'],
            columnNames: ['lvPosId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'requirements_lvs_lvs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'requirementsId',
            type: 'uuid',
          },
          {
            name: 'lvsId',
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
            name: 'RequirementLv',
            referencedTableName: 'requirements',
            referencedColumnNames: ['id'],
            columnNames: ['requirementsId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'LvRequirement',
            referencedTableName: 'lvs',
            referencedColumnNames: ['id'],
            columnNames: ['lvsId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'requirements_task_types_task_types',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'requirementsId',
            type: 'uuid',
          },
          {
            name: 'taskTypesId',
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
            name: 'RequirementLv',
            referencedTableName: 'requirements',
            referencedColumnNames: ['id'],
            columnNames: ['requirementsId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'TaskTypeRequirement',
            referencedTableName: 'task_types',
            referencedColumnNames: ['id'],
            columnNames: ['taskTypesId'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('requirements_task_types_task_types');
    await queryRunner.dropTable('requirements_lvs_lvs');
    await queryRunner.dropTable('requirements_lv_pos_lv_pos');
    await queryRunner.dropTable('requirements');
  }
}
