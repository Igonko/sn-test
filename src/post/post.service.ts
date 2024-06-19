import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { MessageDto } from 'src/common/dtos/message.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto, userId: number) {
    try {
      const post = await this.postRepository.save({
        ...createPostDto,
        user: { id: userId },
      });

      return post;
    } catch (error) {
      throw error;
    }
  }

  public async getAllPosts() {
    try {
      return await this.postRepository.find();
    } catch (error) {
      throw error;
    }
  }

  public async getPost(id: number) {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      return post;
    } catch (error) {
      throw error;
    }
  }

  public async getMyPosts(userId: number) {
    try {
      return await this.postRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });
    } catch (error) {
      throw error;
    }
  }

  public async updatePost(
    updatePostDto: UpdatePostDto,
    userId: number,
    id: number,
  ) {
    try {
      const post = await this.getPostById(id);

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.user?.id !== userId) {
        throw new ForbiddenException(
          'You are not authorized to update this post',
        );
      }

      const preparedPost = { ...post, user: { id: post.user.id } };

      const data = Object.assign(preparedPost, updatePostDto);

      await this.postRepository.update(id, data);

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async deletePost({
    id,
    userId,
  }: {
    id: number;
    userId: number;
  }): Promise<MessageDto> {
    try {
      const post = await this.getPostById(id);

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.user?.id !== userId) {
        throw new ForbiddenException(
          'You are not authorized to delete this post',
        );
      }

      await this.postRepository.delete(id);
      return {
        message: `Post with id ${id} deleted successfully`,
      };
    } catch (error) {
      throw error;
    }
  }

  private async getPostById(id: number): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
