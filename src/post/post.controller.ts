import { RedisService } from './../redis/redis.service';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, GetPostDto, PostBodyDto } from './dto/post.dto';
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
import { User } from 'src/user/entities/user.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly redisService: RedisService,
  ) {}

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
    return await this.postService.create(createPostDto, user.id);
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
  @ApiBody({ type: PostBodyDto })
  @UseGuards(CognitoJwtAuthGuard)
  async getAllPosts(
    @Body() postBodyDto: PostBodyDto,
    @CurrentUser() user: User,
  ) {
    console.log('__________________');
    return await this.postService.getAllPosts(postBodyDto, user);
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
    @CurrentUser() user: User,
  ) {
    return await this.postService.updatePost(updatePostDto, user.id, +id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Delete post by id',
  })
  @ApiBearerAuth('JWT')
  @ApiSecurity('JWT')
  @UseGuards(CognitoJwtAuthGuard)
  async deletePost(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return await this.postService.deletePost({ id: +id, userId: user.id });
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
  //@UseInterceptors(CacheInterceptor)
  @UseGuards(CognitoJwtAuthGuard)
  async getPost(@Param('id') id: string, @CurrentUser() user: User) {
    const cachedPost = await this.redisService.get(`post-${id}`);
    if (cachedPost) {
      return cachedPost;
    }

    const post = await this.postService.getPost(+id, user);
    await this.redisService.set(`post-${post.id}`, post);
    return post;
  }
}
