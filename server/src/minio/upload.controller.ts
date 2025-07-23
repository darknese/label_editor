// upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { MinioService } from './minio.service'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'

@Controller('upload')
export class UploadController {
  constructor(private readonly minioService: MinioService) {}
  @Post('file')
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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST)
    }

    const objectName = await this.minioService.uploadObject(file)

    return {
      message: 'File uploaded successfully',
      fileName: objectName,
      url: `${this.minioService.getServerUrl()}/${this.minioService.getBucket()}/${objectName}`,
    }
  }
}
