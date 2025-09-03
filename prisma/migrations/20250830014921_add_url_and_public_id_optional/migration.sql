/*
  Warnings:

  - You are about to drop the column `mimeType` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `storedName` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."File" DROP COLUMN "mimeType",
DROP COLUMN "storedName",
ADD COLUMN     "publicId" TEXT,
ADD COLUMN     "url" TEXT;
