import { Exclude } from 'class-transformer';
import { EntityAutoDateAndId } from 'src/common/entities/entities';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class User extends EntityAutoDateAndId {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    unique: true,
    default: '',
  })
  email: string;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 36,
    unique: true,
    default: '',
  })
  username: string;

  @Exclude()
  @Column({
    name: 'cognito_id',
    type: 'uuid',
    unique: true,
    default: '7604943e-af3e-4dbf-bcc1-f71046c2ab02',
  })
  cognitoId: string;

  // @Exclude()
  @Column({
    name: 'confirmed',
    type: 'boolean',
    default: false,
  })
  confirmed: boolean;
}
