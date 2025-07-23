import { Module } from '@nestjs/common'
import { TemplatesService } from './templates.service'
import { TemplatesController } from './templates.controller'
import { PrismaService } from '../common/services/prisma.service'

@Module({
  providers: [TemplatesService, PrismaService],
  controllers: [TemplatesController],
})
export class TemplatesModule {}