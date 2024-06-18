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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @Column({
    name: 'user_id',
    type: 'integer',
  })
  user_id: number;
}
