import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class User1720163931282 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
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
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            default: "''",
          },
          {
            name: 'username',
            type: 'varchar',
            length: '36',
            isUnique: true,
            default: "''",
          },
          {
            name: 'cognito_id',
            type: 'uuid',
            isUnique: true,
            default: "'7604943e-af3e-4dbf-bcc1-f71046c2ab02'",
          },
          {
            name: 'confirmed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'avatar',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'customer_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'posts_checked',
            type: 'int',
            default: 0,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['avatar'],
        referencedColumnNames: ['id'],
        referencedTableName: 'minio',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['customer_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customer',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user');
    const foreignKeyAvatar = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('avatar') !== -1,
    );
    const foreignKeyCustomer = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('customer_id') !== -1,
    );

    if (foreignKeyAvatar) {
      await queryRunner.dropForeignKey('user', foreignKeyAvatar);
    }

    if (foreignKeyCustomer) {
      await queryRunner.dropForeignKey('user', foreignKeyCustomer);
    }

    await queryRunner.dropTable('user');
  }
}
