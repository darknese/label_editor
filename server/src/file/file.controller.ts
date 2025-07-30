import { MinioService } from '@minio/minio.service';
import { Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { CurrentUser } from '@auth/current-user.decorator';
import { ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

@Controller('files')
export class FileController {
    constructor(
        private readonly minioService: MinioService,
        private readonly fileService: FileService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
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
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @CurrentUser('id') user: User,
    ) {
        const key = await this.minioService.uploadObject(file);

        const entity = await this.fileService.create({
            name: file.originalname,
            type: 'IMAGE',
            bucket: this.minioService.getBucket(),
            key,
            serverUrl: this.minioService.getServerUrl(),
            userId: user.id,
        });

        return {
            id: entity.id,
            name: entity.name,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/presigned')
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth('access-token')
    async getPresignedUrl(@Param('id') id: string, @CurrentUser('id') user: User) {
        const file = await this.fileService.getUserFile(id, user.id);

        const url = await this.minioService.getPresignedGetUrl(file.key);

        return { url };
    }
}
