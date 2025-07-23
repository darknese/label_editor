import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/services/prisma.service'
import { Template } from './template.entity'

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async createTemplate(data: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.prisma.template.create({ data })
  }

  async upload(file: Express.Multer.File, userId: string) {
    const fileContent = file.buffer.toString('utf-8');

    let data: any;
    try {
      data = JSON.parse(fileContent);
    } catch (err) {
      throw new Error('Невалидный JSON');
    }

    const template = await this.prisma.template.create({
      data: {
        name: file.originalname.replace(/\.[^/.]+$/, ''), // убираем расширение
        data: data,
        userId: userId,
      },
    });

    return {
      message: 'Шаблон успешно сохранён',
      id: template.id,
    };
  }

  async getTemplate(id: string) {
    return this.prisma.template.findUnique({ where: { id } })
  }

  async listTemplates() {
    return this.prisma.template.findMany()
  }

  async updateTemplate(id: string, data: Partial<Template>) {
    return this.prisma.template.update({ where: { id }, data })
  }

  async deleteTemplate(id: string) {
    return this.prisma.template.delete({ where: { id } })
  }
}