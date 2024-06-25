import { EntityAutoDateAndId } from 'src/common/entities/entities';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('like')
export class Like extends EntityAutoDateAndId {
  @ManyToOne(() => User, ({ id }) => id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, ({ id }) => id)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Comment, ({ id }) => id)
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;
}
