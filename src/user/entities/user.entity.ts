import { EntityAutoDateAndId } from 'src/entities/entities';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class User extends EntityAutoDateAndId {
  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'username', type: 'varchar', length: 36, unique: true })
  username: string;

  @Column({ name: 'cognito_id', type: 'uuid', unique: true })
  cognitoId: string;
}
