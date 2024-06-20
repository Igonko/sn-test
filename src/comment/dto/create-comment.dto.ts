import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @MaxLength(512, {
    message: "Coment can't be longer than 512 characters",
  })
  comment: string;

  @ApiProperty()
  postId: number;
}
