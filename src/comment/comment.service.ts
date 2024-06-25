import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  public async create(createCommentDto: CreateCommentDto, userId: number) {
    try {
      const { comment, postId } = createCommentDto;

      const newComment = await this.commentRepository.save({
        comment,
        post: { id: postId },
        user: { id: userId },
      });

      return newComment;
    } catch (error) {
      throw error;
    }
  }

  public async findAll() {
    try {
      const comments = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post')
        .loadRelationCountAndMap('comment.likeCount', 'comment.like')
        .getMany();

      if (!comments.length) {
        throw new NotFoundException('There are no comments yet');
      }

      const updatedComments = this.formatComments(comments);

      return updatedComments;
    } catch (error) {
      throw error;
    }
  }

  public async findOne(id: string) {
    try {
      const comment = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post')
        .loadRelationCountAndMap('comment.likeCount', 'comment.like')
        .where('comment.id = :id', { id: +id })
        .getOne();

      return this.formatComments(comment);
    } catch (error) {
      throw error;
    }
  }

  public async update(id: string, userId: number, comment: string) {
    try {
      const neededComment = await this.commentRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('comment.post', 'post')
        .loadRelationCountAndMap('comment.likeCount', 'comment.like')
        .where('comment.id = :id', { id: +id })
        .getOne();

      if (!neededComment) {
        throw new NotFoundException('Comment not found');
      }

      if (neededComment.user?.id !== userId) {
        throw new ForbiddenException(
          'You are not authorized to update this post',
        );
      }

      const data = Object.assign(neededComment, comment);

      await this.commentRepository.update(id, data);

      return this.formatComments(data);
    } catch (error) {
      throw error;
    }
  }

  public async remove(id: string, userId: number) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: +id },
        relations: ['user'],
      });

      if (!comment) {
        throw new NotFoundException('There are no comments yet');
      }

      if (comment.user.id !== userId) {
        throw new ForbiddenException(
          'You are not authorized to delete this comment',
        );
      }

      await this.commentRepository.delete(+id);

      return {
        message: 'Comment deleted successfuly',
      };
    } catch (error) {
      throw error;
    }
  }

  private formatComments(comments: Comment[] | Comment) {
    if (Array.isArray(comments)) {
      return comments.map((comment) => ({
        ...comment,
        id: comment.id,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        post: comment.post.id,
        user: {
          id: comment.user.id,
          userName: comment.user.username,
          userEmail: comment.user.email,
        },
      }));
    }

    return {
      ...comments,
      id: comments.id,
      comment: comments.comment,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      post: comments.post.id,
      user: {
        id: comments.user.id,
        userName: comments.user.username,
        userEmail: comments.user.email,
      },
    };
  }
}
