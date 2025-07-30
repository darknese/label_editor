import { Module } from '@nestjs/common';
import { MinioService } from "./minio.service";

@Module({
  providers: [MinioService],
  controllers: [],
  exports: [MinioService],
})
export class UploadModule { }
