import { EntityAutoDateAndId } from 'src/common/entities/entities';
import { Column, Entity } from 'typeorm';

@Entity('minio')
export class Minio extends EntityAutoDateAndId {
  @Column({ name: 'file_name', type: 'varchar' })
  fileName: string;

  @Column({ name: 'e_tag', type: 'varchar' })
  eTag: string;
}

export default Minio;
