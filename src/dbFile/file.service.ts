import { Injectable, NotFoundException } from '@nestjs/common';
import DbFile from './enteties/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class DbFileService {
  constructor(
    @InjectRepository(DbFile)
    private readonly dbFileRepository: Repository<DbFile>,
  ) {}

  public async getFileById(id: number) {
    try {
      const file = await this.dbFileRepository.findOne({ where: { id } });

      if (!file) {
        throw new NotFoundException();
      }
      return file;
    } catch (error) {
      throw error;
    }
  }

  async uploadDatabaseFileWithQueryRunner(
    dataBuffer: Buffer,
    filename: string,
    queryRunner: QueryRunner,
  ) {
    const newFile = await queryRunner.manager.create(DbFile, {
      filename,
      data: dataBuffer,
    });
    await queryRunner.manager.save(DbFile, newFile);
    return newFile;
  }

  async deleteFileWithQueryRunner(fileId: number, queryRunner: QueryRunner) {
    try {
      await queryRunner.manager.delete(DbFile, fileId);
      return {
        message: 'Avatar was removed',
      };
    } catch (error) {
      throw error;
    }
  }
}
