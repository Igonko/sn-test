import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DbFile from './enteties/file.entity';
import { DbFileService } from './file.service';
import { DbFileController } from './file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DbFile])],
  controllers: [DbFileController],
  providers: [DbFileService],
  exports: [DbFileService],
})
export class DbFileModule {}
