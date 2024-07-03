import { Inject, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { InjectRepository } from '@nestjs/typeorm';
import Minio from './enteties/minio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MinioService {
  constructor(
    @InjectRepository(Minio)
    private readonly minioRepository: Repository<Minio>,
    private readonly configService: ConfigService,
    @Inject('MINIO_CONNECTION') private readonly minioClient: S3Client,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    try {
      const fileName = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
      const command = new PutObjectCommand({
        Bucket: this.configService.get<string>('MINIO_BUCKET_NAME'),
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      const metadata = await this.minioClient.send(command);

      const data = await this.minioRepository.save({
        fileName,
        eTag: metadata.ETag,
      });

      return data;
    } catch (error) {
      throw error;
    }
  }

  public async getFile(objectName: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.configService.get<string>('MINIO_BUCKET_NAME'),
        Key: objectName,
      });

      const url = await getSignedUrl(this.minioClient, command, {
        expiresIn: 3600,
      });

      return {
        url,
      };
    } catch (error) {
      throw error;
    }
  }
}
