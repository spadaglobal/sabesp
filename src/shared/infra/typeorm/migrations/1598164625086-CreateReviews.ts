import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateReviews1598164625086 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reviews',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'value',
            type: 'varchar',
          },
          {
            name: 'observation',
            type: 'varchar',
          },
          {
            name: 'reason_id',
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
            name: 'ReasonReviews',
            referencedTableName: 'reasons',
            referencedColumnNames: ['id'],
            columnNames: ['reason_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'reviews_requirements',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'review_id',
            type: 'uuid',
          },
          {
            name: 'requirement_id',
            type: 'uuid',
          },
          {
            name: 'lv_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'lv_pos_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
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
            name: 'ReviewsRequirements',
            referencedTableName: 'reviews',
            referencedColumnNames: ['id'],
            columnNames: ['review_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'RequirementsReviews',
            referencedTableName: 'requirements',
            referencedColumnNames: ['id'],
            columnNames: ['requirement_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'LvsReviews',
            referencedTableName: 'lvs',
            referencedColumnNames: ['id'],
            columnNames: ['lv_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'LvsPosReviews',
            referencedTableName: 'lvPos',
            referencedColumnNames: ['id'],
            columnNames: ['lv_pos_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reviews_requirements');
    await queryRunner.dropTable('reviews');
  }
}
