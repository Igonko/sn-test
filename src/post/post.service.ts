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

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    try {
      await this.postRepository.save(createPostDto);

      return 'Post created';
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

  public async getMyPosts(user_id: number) {
    try {
      return await this.postRepository.find({ where: { user_id } });
    } catch (error) {
      throw error;
    }
  }

  public async updatePost(updatePostDto: UpdatePostDto) {
    try {
      const post = await this.postRepository.findOne({
        where: { id: updatePostDto.id },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.user_id !== updatePostDto.user_id) {
        throw new ForbiddenException(
          'You are not authorized to update this post',
        );
      }

      Object.assign(post, updatePostDto);

      await this.postRepository.update(updatePostDto.id, updatePostDto);

      return `Post with id ${updatePostDto.id} updated successfully`;
    } catch (error) {
      throw error;
    }
  }

  public async deletePost({ id, user_id }: { id: number; user_id: number }) {
    try {
      const post = await this.postRepository.findOne({
        where: { id },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.user_id !== user_id) {
        throw new ForbiddenException(
          'You are not authorized to delete this post',
        );
      }

      await this.postRepository.delete(id);
      return `Post with id ${id} deleted successfully`;
    } catch (error) {
      throw error;
    }
  }
}
