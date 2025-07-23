# Инструкции Copilot для label_editor

## Обзор проекта
- **Монорепозиторий:** Содержит приложения `client/` (React) и `server/` (NestJS).
- **Назначение:** Редактор этикеток с управлением шаблонами, аутентификацией пользователей и хранением файлов через Minio (S3-совместимый).

## Архитектура
- **client/**: React-приложение (Create React App), Zustand для состояния, Konva для редактирования на канвасе. Ключевые файлы: `src/components/LabelEditor.tsx`, `src/store/useEditorStore.ts`.
- **server/**: Приложение на NestJS, Prisma для PostgreSQL, JWT-аутентификация, интеграция с Minio. Основные модули: `auth`, `users`, `minio`, `templates`.
- **infrastructure/**: Docker-конфиги и папки данных для локальных сервисов. Не коммитить папки `data/` в git.

## Рабочие процессы
- **Фронтенд:**
  - Разработка: `cd client && npm start` (http://localhost:3000)
  - Сборка: `cd client && npm run build`
  - Тесты: `cd client && npm test`
- **Бэкенд:**
  - Разработка: `cd server && npm run start:dev` (http://localhost:8000)
  - Миграции Prisma: `npx prisma migrate dev --name <desc>`
  - Тесты: `cd server && npm run test`
- **Docker Compose:**
  - `docker-compose up` (запускает postgres, minio и др.)

## Паттерны и соглашения
- **Шаблоны:** В шаблонах хранится только метаданные и ссылки на изображения (не сами изображения). Изображения загружаются в Minio и ссылаются по URL.
- **Аутентификация:** JWT-токены, секрет из `.env` (`SECRET_KEY`). Всегда используйте DI для `ConfigService`.
- **Prisma:** Модели в `server/prisma/schema.prisma`. Не коммитить сгенерированные SQL-миграции, если не требуется командный просмотр.
- **Инфраструктура:** Игнорировать `infrastructure/postgres/data/` и `infrastructure/s3/data/` через `.gitignore`.
- **Обработка ошибок:** Ошибки аутентификации возвращают 401 с сообщением `Unauthorized`.

## Точки интеграции
- **Minio:** Для хранения файлов. Доступ через `MinioService` на бэкенде. Данные для доступа в `.env`.
- **Prisma:** Весь доступ к БД через `PrismaService`. Метаданные пользователей, шаблонов и файлов хранятся в PostgreSQL.
- **JWT:** Аутентификация через стратегию `passport-jwt`. Токен передаётся как `Authorization: Bearer <token>`.

## Примеры
- **Загрузка шаблона:**
  - POST `/templates/upload` с JWT и multipart-файлом. В шаблоне JSON хранятся только ссылки на изображения.
- **Логин пользователя:**
  - POST `/auth/login` возвращает JWT-токен. Используйте для всех защищённых эндпоинтов.

## Ключевые файлы
- `client/src/components/LabelEditor.tsx` — основной UI редактора
- `server/src/minio/minio.service.ts` — интеграция с Minio
- `server/src/auth/strategies/jwt.strategy.ts` — валидация JWT
- `server/prisma/schema.prisma` — схема БД
- `.env` — секреты и конфиг сервисов
- `.gitignore` — игнорирование папок данных инфраструктуры

---
Если какой-то рабочий процесс или интеграция неясны — уточните у пользователя или запросите пример.
