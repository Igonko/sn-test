import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @MaxLength(1024, {
    message: "Post can't be longer than 1024 characters",
  })
  post: string;

  @ApiProperty()
  user_id: number;
}

export class GetPostDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  post: string;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}
