import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { LikeModule } from './like/like.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { StripeModule } from './stripe/stripe.module';
import { MinioModule } from './minio/minio.module';
import { join } from 'path';
import { User1720163931282 } from './migrations/1720163931282-User';
import { Comment1720166704970 } from './migrations/1720166704970-Comment';

@Module({
  imports: [
    UserModule,
    ProfileModule,
    LikeModule,
    PostModule,
    StripeModule,
    CommentModule,
    AuthModule,
    MinioModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          migrations: [User1720163931282, Comment1720166704970],
          migrationsTableName: 'migration',
          migrationsRun: true,
          synchronize: false,
          logging: true,
          cli: {
            migrationsDir: 'src/migrations',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
