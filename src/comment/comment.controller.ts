import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CognitoJwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserDto } from 'src/user/dto/current-user.dto';
import { CommentDto, PatchCommentDto } from './dto/comment.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Create comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created.',
    type: CommentDto,
  })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.commentService.create(createCommentDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({
    status: 200,
    description: 'Get all comments',
    type: [CommentDto],
  })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get comment by id' })
  @ApiResponse({
    status: 200,
    description: 'Get comment by id',
    type: CommentDto,
  })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Get updated successfuly' })
  @ApiResponse({
    status: 201,
    description: 'Comment updated successfuly',
    type: CommentDto,
  })
  @ApiBody({ type: PatchCommentDto })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() comment: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.commentService.update(id, user.id, comment);
  }

  @Delete(':id')
  @Get(':id')
  @ApiOperation({ summary: 'Delete comment by id' })
  @ApiResponse({ status: 200, description: 'Delete comment by id' })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
    return this.commentService.remove(id, user.id);
  }
}
