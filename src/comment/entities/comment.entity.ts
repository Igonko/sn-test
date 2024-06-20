import { EntityAutoDateAndId } from 'src/common/entities/entities';
import { Like } from 'src/like/entities/like.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('comment')
export class Comment extends EntityAutoDateAndId {
  @Column({
    name: 'comment',
    type: 'varchar',
    length: 512,
    default: '',
  })
  comment: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comment)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @OneToMany(() => Like, (like) => like.comment)
  @JoinColumn({ name: 'like_id' })
  like: Like[];
}
