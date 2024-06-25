import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AwsModule } from 'src/aws/aws.module';
import { PassportModule } from '@nestjs/passport';
import { AwsCognitoConfigService } from 'src/aws/aws-cognito-config.service';
import { CognitoJwtStrategy } from 'src/auth/strategies/aws-cognito-jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { CommentModule } from 'src/comment/comment.module';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment]),
    ConfigModule,
    AwsModule,
    UserModule,
    CommentModule,
    PassportModule.register({ defaultStrategy: 'cognitoJwtStrategy' }),
  ],
  controllers: [PostController],
  providers: [
    PostService,
    ConfigService,
    AwsCognitoConfigService,
    CognitoJwtStrategy,
  ],
  exports: [PostService],
})
export class PostModule {}
