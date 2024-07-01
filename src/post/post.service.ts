import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, PostBodyDto } from './dto/post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { MessageDto } from 'src/common/dtos/message.dto';
import { Comment } from 'src/comment/entities/comment.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  private async getPostById(id: number): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  public async create(createPostDto: CreatePostDto, userId: number) {
    try {
      const post = await this.postRepository.save({
        ...createPostDto,
        user: { id: userId },
      });

      return await this.getPost(post.id);
    } catch (error) {
      throw error;
    }
  }

  public async getAllPosts({ skip = 0, take = 50 }: PostBodyDto) {
    try {
      const posts = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .loadRelationCountAndMap('post.likesCount', 'post.like')
        .loadRelationCountAndMap('post.commentsCount', 'post.comment')
        .select(['post', 'user.id', 'user.email', 'user.username'])
        .skip(skip)
        .take(take)
        .limit(100)
        .getMany();

      const comments = await Promise.all(
        posts.map(({ id }) =>
          this.commentRepository
            .createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .orderBy('comment.createdAt', 'DESC')
            .leftJoin('comment.post', 'post')
            .skip(0)
            .take(5)
            .loadRelationCountAndMap('comment.likeCount', 'comment.like')
            .select([
              'comment',
              'user.id',
              'user.email',
              'user.username',
              'post.id',
            ])
            .where('post.id = :id', { id })
            .getMany(),
        ),
      );

      const updatedPosts = posts.map((post) => {
        if (comments.some((comment) => comment?.[0]?.post.id === post.id)) {
          return {
            ...post,
            comments: comments.find((item) => item?.[0]?.post.id === post.id),
          };
        } else {
          return {
            ...post,
            comments: null,
          };
        }
      });

      if (!updatedPosts.length) {
        throw new NotFoundException('No posts found');
      }

      return updatedPosts;
    } catch (error) {
      throw error;
    }
  }

  public async getPost(id: number) {
    try {
      const post = await this.postRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .loadRelationCountAndMap('post.likesCount', 'post.like')
        .loadRelationCountAndMap('post.commentsCount', 'post.comment')
        .select(['post', 'user.id', 'user.email', 'user.username'])
        .where('post.id = :id', { id })
        .getOne();

      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .orderBy('comment.createdAt', 'DESC')
        .leftJoin('comment.post', 'post')
        .skip(0)
        .take(5)
        .loadRelationCountAndMap('comment.likeCount', 'comment.like')
        .select([
          'comment',
          'user.id',
          'user.email',
          'user.username',
          'post.id',
        ])
        .where('post.id = :id', { id })
        .getMany();

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      return { ...post, comments };
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
      const post = await this.getPost(id);

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.user?.id !== userId) {
        throw new ForbiddenException(
          'You are not authorized to update this post',
        );
      }

      await this.postRepository.update(id, updatePostDto);

      return await this.getPost(id);
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
}
