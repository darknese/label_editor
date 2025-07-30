import { PrismaService } from '@common/services/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FileType, User } from '@prisma/client';

@Injectable()
export class FileService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: {
        name: string,
        type: FileType,
        bucket: string,
        key: string,
        serverUrl: string,
        userId: string,
    }) {
        return await this.prisma.file.create({ data });
    }

    async getUserFile(fileId: string, userId: string) {
        const file = await this.prisma.file.findUnique({ where: { id: fileId } });
        console.log('File found:', file);
        console.log('User ID:', userId);
        if (!file || file.userId !== userId) {
            throw new NotFoundException('File not found or access denied');
        }
        return file;
    }
}
