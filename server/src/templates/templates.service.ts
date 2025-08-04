import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { MinioService } from '../minio/minio.service';
import { FileService } from '../file/file.service';
import { Template } from './template.entity';
import { File } from '@prisma/client';

@Injectable()
export class TemplatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
    private readonly fileService: FileService,
  ) { }

  async createTemplate(data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.prisma.template.create({ data });
  }

  async upload(file: Express.Multer.File, userId: string) {
    let jsonData: any;

    try {
      jsonData = JSON.parse(file.buffer.toString('utf-8'));
    } catch {
      throw new BadRequestException('Невалидный JSON-файл');
    }

    const templateName = file.originalname.replace(/\.[^/.]+$/, '');

    const template = await this.prisma.template.create({
      data: {
        name: templateName,
        data: jsonData,
        userId,
      },
    });

    return {
      message: 'Шаблон успешно сохранён',
      id: template.id,
    };
  }

  async getTemplate(id: string) {
    const template = await this.prisma.template.findUnique({ where: { id } });
    if (!template) throw new NotFoundException(`Шаблон с id ${id} не найден`);
    return template;
  }

  async listTemplates() {
    return this.prisma.template.findMany();
  }

  async updateTemplate(id: string, data: Partial<Template>) {
    return this.prisma.template.update({ where: { id }, data });
  }

  async deleteTemplate(id: string) {
    return this.prisma.template.delete({ where: { id } });
  }

  /**
   * Рекурсивный парсер: вытаскивает все значения с ключом вида *fileId*
   */
  private extractFileIds(obj: any): string[] {
    const result = new Set<string>();

    const walk = (node: any) => {
      if (Array.isArray(node)) {
        node.forEach(walk);
      } else if (node && typeof node === 'object') {
        for (const [key, value] of Object.entries(node)) {
          if (key.toLowerCase().includes('fileid') && typeof value === 'string') {
            result.add(value);
          } else {
            walk(value);
          }
        }
      }
    };

    walk(obj);
    return Array.from(result);
  }

  /**
   * Получает шаблон и подготавливает Map fileId → presignedUrl
   */
  async getTemplateWithPresignedUrls(id: string) {
    const template = await this.getTemplate(id);

    const fileIds = this.extractFileIds(template.data);

    const files: File[] = await this.prisma.file.findMany({
      where: { id: { in: fileIds } },
    });

    const fileUrlMap: Record<string, string> = {};

    await Promise.all(
      files.map(async (file) => {
        try {
          const url = await this.minioService.getPresignedGetUrl(file.key);
          fileUrlMap[file.id] = url;
        } catch {
          // Не добавляем URL, если генерация не удалась
        }
      }),
    );

    return {
      template,
      fileUrls: fileUrlMap,
    };
  }
}
