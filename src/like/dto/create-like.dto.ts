import { ApiProperty } from '@nestjs/swagger';

export class CreatePostLikeDto {
  @ApiProperty()
  postId: number;
}

export class CreateCommentLikeDto {
  @ApiProperty()
  commentId: number;
}
