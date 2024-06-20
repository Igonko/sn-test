import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from './../../like/entities/like.entity';
import { EntityAutoDateAndId } from 'src/common/entities/entities';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('post')
export class Post extends EntityAutoDateAndId {
  @Column({
    name: 'post',
    type: 'varchar',
    length: 1024,
    default: '',
  })
  post: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Like, (like) => like.post)
  like: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comment: Comment[];
}
