import { registerAs } from '@nestjs/config';

export default registerAs('fileStorage', () => ({
    // Использовать ли presigned URL по умолчанию
    usePresignedByDefault: process.env.USE_PRESIGNED_URLS === 'true',

    // Время жизни presigned URL в секундах (по умолчанию 1 час)
    presignedUrlExpires: parseInt(process.env.PRESIGNED_URL_EXPIRES || '3600'),

    // Максимальный размер файла в байтах (по умолчанию 10MB)
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),

    // Разрешенные типы файлов
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'text/plain',
        'application/json',
    ],

    // Папка для временных файлов
    tempFolder: process.env.TEMP_FOLDER || '/tmp',

    // Настройки MinIO
    minio: {
        serverUrl: process.env.MINIO_SERVER_URL,
        endPoint: process.env.MINIO_END_POINT,
        port: parseInt(process.env.MINIO_PORT || '9000'),
        useSSL: process.env.MINIO_USE_SSL === 'true',
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
        bucket: process.env.MINIO_BUCKET || 'bucket',
    },
})); 