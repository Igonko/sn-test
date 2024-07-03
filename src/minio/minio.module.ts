import { Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { MinioController } from './minio.controller';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Minio from './enteties/minio.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Minio])],
  controllers: [MinioController],
  providers: [
    MinioService,
    {
      provide: 'MINIO_CONNECTION',
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          endpoint: configService.get('MINIO_ENDPOINT'),
          region: configService.get('MINIO_REGION'),
          credentials: {
            accessKeyId: configService.get('MINIO_ACCESS_KEY'),
            secretAccessKey: configService.get('MINIO_SECRET_KEY'),
          },
          forcePathStyle: true,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['MINIO_CONNECTION', MinioService],
})
export class MinioModule {}
