/*
  Warnings:

  - You are about to drop the `image_assets` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'DOCUMENT', 'VIDEO', 'OTHER');

-- DropForeignKey
ALTER TABLE "image_assets" DROP CONSTRAINT "image_assets_templateId_fkey";

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "template_id" TEXT,
ADD COLUMN     "type" "FileType" NOT NULL DEFAULT 'OTHER';

-- DropTable
DROP TABLE "image_assets";

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
