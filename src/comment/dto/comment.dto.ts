import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class CommentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  user: User;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  likeCount: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PatchCommentDto {
  @ApiProperty()
  comment: string;
}
