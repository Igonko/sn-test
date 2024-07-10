import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableColumnOptions,
} from 'typeorm';

export class AddTitleFieldToThePost1720597354774 implements MigrationInterface {
  private tableName = 'post';

  private newColumn: TableColumnOptions = {
    name: 'title',
    type: 'varchar',
    length: '128',
    default: "''",
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      this.tableName,
      new TableColumn(this.newColumn),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(this.tableName, this.newColumn.name);
  }
}
