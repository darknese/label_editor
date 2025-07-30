import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@common/services/prisma.service';
import { MinioService } from '@minio/minio.service';

@Module({
  controllers: [FileController],
  providers: [FileService, PrismaService, MinioService],
  exports: [FileService],
})
export class FileModule { }
