import { PartialType } from '@nestjs/mapped-types';
import { CreatePostLikeDto } from './create-like.dto';

export class UpdateLikeDto extends PartialType(CreatePostLikeDto) {}
