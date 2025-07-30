import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './common/services/prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from '@minio/minio.module';
import { ConfigModule } from '@nestjs/config';
import { TemplatesModule } from 'templates/templates.module';
import { FileService } from './file/file.service';
import { FileModule } from './file/file.module';


@Module({
  imports: [
    UsersModule, 
    AuthModule, 
    UploadModule,  
    ConfigModule.forRoot({ isGlobal: true }),
    TemplatesModule,
    FileModule],

  controllers: [AppController],
  providers: [AppService, PrismaService, FileService]
})
export class AppModule {}
