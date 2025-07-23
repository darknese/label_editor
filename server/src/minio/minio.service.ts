import * as crypto from 'crypto'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectMinioClient } from '@minio/minio.decorators'
import { Client as MinioClient } from 'minio'
import { ConfigService } from '@nestjs/config'
import { Readable as ReadableStream } from 'stream'
import { BucketItemStat } from 'minio'


@Injectable()
export class MinioService {
  private readonly serverUrl: string
  private readonly endPoint: string
  private readonly bucket: string
  minioClient: MinioClient

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.serverUrl = this.configService.getOrThrow<string>('MINIO_SERVER_URL');
    this.endPoint = this.configService.getOrThrow<string>('MINIO_END_POINT');
    this.bucket = this.configService.get<string>('MINIO_BUCKET', 'bucket');
    this.minioClient = new MinioClient({
      endPoint: this.configService.getOrThrow<string>('MINIO_END_POINT'),
      port: parseInt(this.configService.get<string>('MINIO_PORT', '9000')),
      useSSL: false, // или true, если ты настроил HTTPS
      accessKey: this.configService.getOrThrow<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.getOrThrow<string>('MINIO_SECRET_KEY'),
    })
  }

  /**
   * Server url minio.
   */
  getServerUrl(): string {
    return this.serverUrl
  }
  /**
   * Bucket s3.
   */
  getBucket(): string {
    return this.bucket
  }

  /**
   * End point s3.
   */
  getEndPoint(): string {
    return this.endPoint
  }

  async listBuckets() {
    return await this.minioClient.listBuckets()
  }

  /**
   * Получение потока на чтение файла.
   * @param objectName - имя объекта
   */
  async getFileObject(objectName: string): Promise<ReadableStream> {
    return await this.minioClient.getObject(this.getBucket(), objectName)
  }

  /**
   * Загружаем файл в S3
   * @param file
   * @return objectName
   */
  async uploadObject(file): Promise<string> {
    const [hashedFileName, ext] = this.hashedName(file.originalname || file.fileName)

    const objectName = `${hashedFileName}${ext}`
    const metaData = {
      'Content-Type': file.mimetype,
    }
    try {
      await this.minioClient.putObject(this.bucket, objectName, file.buffer, file.size, metaData)
    } catch (e) {
      throw new HttpException(`Error put object to s3: ${e}`, HttpStatus.BAD_REQUEST)
    }
    return objectName
  }

  /**
   * Получение хешированного имени файла
   * @param name
   */
  hashedName(name: string): string[] {
    const hashedFileName = crypto.createHash('md5').update(Date.now().toString()).digest('hex')
    const ext = name.substring(name.lastIndexOf('.'), name.length)
    return [hashedFileName, ext]
  }

  /**
   * Получение ссылки для загрузки файла в s3
   * @param fileName
   */
  async getPresignedPutUrl(fileName: string): Promise<[string, string, string]> {
    const [hashedFileName, ext] = this.hashedName(fileName);

    try {
      const fileKey = `${hashedFileName}${ext}`;
      const presignedUrl = await this.minioClient.presignedPutObject(this.bucket, fileKey);
      return [this.bucket, fileKey, presignedUrl];
    } catch (e) {
      throw new HttpException(`Error creating presigned url: ${e}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Проверяем, если ли объект в s3
   * @param name
   * @return информацию или false - если файла нет
   */
  async existsObject(name: string): Promise<BucketItemStat | boolean> {
    try {
      return await this.minioClient.statObject(this.bucket, name)
    } catch {
      return false
    }
  }
}
