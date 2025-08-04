import { Module } from '@nestjs/common'
import { TemplatesService } from './templates.service'
import { TemplatesController } from './templates.controller'
import { PrismaService } from '../common/services/prisma.service'
import { FileService } from 'file/file.service'
import { MinioService } from 'minio/minio.service'

@Module({
  providers: [TemplatesService, PrismaService, FileService, MinioService],
  controllers: [TemplatesController],
})
export class TemplatesModule { }