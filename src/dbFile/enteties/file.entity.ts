import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('db_file')
export class DbFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({
    type: 'bytea',
  })
  data: Uint8Array;
}

export default DbFile;
