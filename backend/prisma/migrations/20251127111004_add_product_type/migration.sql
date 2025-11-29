-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "fileUrl" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'physical';
