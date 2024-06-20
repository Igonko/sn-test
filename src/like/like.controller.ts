import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { LikeService } from './like.service';
import { CreateCommentLikeDto, CreatePostLikeDto } from './dto/create-like.dto';
import { CognitoJwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserDto } from 'src/user/dto/current-user.dto';

@ApiTags('Like')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @ApiOperation({ summary: 'Create like' })
  @ApiResponse({ status: 201, description: 'Like created.' })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  create(
    @Body() createLikeDto: CreatePostLikeDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const { postId } = createLikeDto;
    return this.likeService.create(postId, user.id);
  }

  @Post('comment')
  @ApiOperation({ summary: 'Create like' })
  @ApiResponse({ status: 201, description: 'Like created.' })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  createComment(
    @Body() createLikeDto: CreateCommentLikeDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const { commentId } = createLikeDto;
    return this.likeService.createComment(commentId, user.id);
  }

  @Get()
  findAll() {
    return this.likeService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeService.remove(id);
  }
}
