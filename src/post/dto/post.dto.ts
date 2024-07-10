import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @MaxLength(1024, {
    message: "Post can't be longer than 1024 characters",
  })
  post: string;

  @ApiProperty()
  @MaxLength(128, {
    message: "Post can't be longer than 128 characters",
  })
  title: string;
}

export class GetPostDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  post: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  createdAt: Date;
}

export class PostBodyDto {
  @ApiProperty()
  skip: number;

  @ApiProperty()
  take: number;
}
