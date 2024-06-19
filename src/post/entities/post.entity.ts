import { EntityAutoDateAndId } from 'src/common/entities/entities';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity('post')
export class Post extends EntityAutoDateAndId {
  @Column({
    name: 'post',
    type: 'varchar',
    length: 1024,
    default: '',
  })
  post: string;

  @ManyToOne(() => User, ({ id }) => id)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
