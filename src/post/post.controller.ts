import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, GetPostDto } from './dto/post.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CognitoJwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUserDto } from 'src/user/dto/current-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: 201, description: 'Post created.' })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  async create(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return await this.postService.create({
      ...createPostDto,
      user_id: user.id,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 201,
    description: 'Successful creation',
    type: [GetPostDto],
  })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  async getAllPosts() {
    return await this.postService.getAllPosts();
  }

  @Get('user')
  @ApiOperation({ summary: 'Get my posts' })
  @ApiResponse({
    status: 201,
    description: 'Get my posts',
    type: [GetPostDto],
  })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  async getMyPosts(@CurrentUser() user: CurrentUserDto) {
    return await this.postService.getMyPosts(user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({
    status: 201,
    description: 'Update post',
  })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  @ApiBody({ type: UpdatePostDto })
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return await this.postService.updatePost({
      ...updatePostDto,
      user_id: user.id,
      id: +id,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Delete post by id',
    type: GetPostDto,
  })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  async deletePost(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return await this.postService.deletePost({ id: +id, user_id: user.id });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get posts by id' })
  @ApiResponse({
    status: 200,
    description: 'Get post by id',
    type: GetPostDto,
  })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  async getPost(@Param('id') id: string) {
    return await this.postService.getPost(+id);
  }
}
