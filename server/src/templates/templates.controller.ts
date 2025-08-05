import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common'
import { TemplatesService } from './templates.service'
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { CurrentUser } from '@auth/current-user.decorator';
import { User } from '@prisma/client';

@Controller('templates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) { }

  @Post()
  create(@Body() dto, @CurrentUser('id') userId: string) {
    // Фильтруем только нужные поля для создания шаблона
    const { imageIds, ...templateData } = dto;
    return this.templatesService.createTemplate({ ...templateData, userId })
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadTemplate(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') user: User,
  ) {
    return this.templatesService.upload(file, user);
  }

  @Get(':id')
  async get(@Param('id') id: string, @CurrentUser('id') user: User) {
    return this.templatesService.getTemplateWithPresignedUrls(id, user.id)
  }

  @Get()
  list(@CurrentUser('id') user: User) {
    console.log('userId:', user)
    return this.templatesService.listTemplates(user.id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto, @CurrentUser('id') user: User) {
    // Фильтруем только нужные поля для обновления шаблона
    const { imageIds, ...updateData } = dto;
    return this.templatesService.updateTemplate(id, updateData, user.id)
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('id') user: User) {
    return this.templatesService.deleteTemplate(id, user.id)
  }
}