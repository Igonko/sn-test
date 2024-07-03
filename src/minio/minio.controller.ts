import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from './minio.service';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.minioService.uploadFile(file);
  }

  @Get(':file')
  async getFile(@Param('file') file: string) {
    return await this.minioService.getFile(file);
  }
}
