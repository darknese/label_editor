import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId }
    })
  }

  findByEmail(email: string): Promise<User | null> {
    console.log('Finding user by email:', email);
    const user = this.prisma.user.findUnique({
      where: { email }
    });
    console.log('User found:', user);
    return user
  }

}
