import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  postId: number;

  @ApiProperty({ type: [Number] })
  likeId: [number];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PatchCommentDto {
  @ApiProperty()
  comment: string;
}
