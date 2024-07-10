import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './post.dto';
import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty()
  @MaxLength(1024, {
    message: "Post can't be longer than 1024 characters",
  })
  post: string;

  @ApiProperty()
  @MaxLength(128, {
    message: "Title can't be longer than 128 characters",
  })
  title: string;
}
