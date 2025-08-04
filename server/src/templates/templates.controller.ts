import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common'
import { TemplatesService } from './templates.service'
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';

@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) { }

  @Post()
  create(@Body() dto) {
    return this.templatesService.createTemplate(dto)
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('access-token')
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
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.templatesService.upload(file, userId);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.templatesService.getTemplateWithPresignedUrls(id)
  }

  @Get()
  list() {
    return this.templatesService.listTemplates()
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto) {
    return this.templatesService.updateTemplate(id, dto)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.templatesService.deleteTemplate(id)
  }
}