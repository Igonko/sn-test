import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
  ) {}

  private async getUsersLike(
    resourceId: number,
    userId: number,
    comment = false,
  ): Promise<Like> {
    const like = comment
      ? await this.likeRepository.findOne({
          where: [{ comment: { id: resourceId } }, { user: { id: userId } }],
          relations: ['user', 'post', 'comment'],
        })
      : await this.likeRepository.findOne({
          where: [{ post: { id: resourceId } }, { user: { id: userId } }],
          relations: ['user', 'post', 'comment'],
        });

    return like;
  }

  public async create(postId: number, userId: number) {
    const like = await this.getUsersLike(postId, userId);

    if (like?.post?.id === postId && like?.user?.id === userId) {
      await this.remove(like.id);
      return {
        message: 'Like was removed from the post',
      };
    }

    return this.likeRepository.save({
      post: { id: postId },
      user: { id: userId },
    });
  }

  public async createComment(commentId: number, userId: number) {
    const like = await this.getUsersLike(commentId, userId, true);

    if (like?.comment?.id === commentId && like?.user?.id === userId) {
      await this.remove(like.id);
      return {
        message: 'Like was removed from the post',
      };
    }

    return this.likeRepository.save({
      comment: { id: commentId },
      user: { id: userId },
    });
  }

  findAll() {
    return `This action returns all like`;
  }

  public async remove(id: string | number) {
    return await this.likeRepository.delete(id);
  }
}
