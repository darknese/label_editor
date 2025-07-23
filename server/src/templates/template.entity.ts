import { Prisma } from '@prisma/client'

export class Template implements Prisma.TemplateUncheckedCreateInput {
  id?: string
  name: string
  description?: string
  data: Prisma.InputJsonValue
  userId: string
  createdAt?: Date
  updatedAt?: Date
}