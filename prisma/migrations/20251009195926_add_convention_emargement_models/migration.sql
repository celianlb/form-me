/*
  Warnings:

  - Added the required column `kind` to the `GeneratedDocument` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."DocumentKind" AS ENUM ('CONVENTION', 'EMARGEMENT');

-- DropForeignKey
ALTER TABLE "public"."GeneratedDocument" DROP CONSTRAINT "GeneratedDocument_templateId_fkey";

-- AlterTable
ALTER TABLE "public"."GeneratedDocument" ADD COLUMN     "batchId" TEXT,
ADD COLUMN     "kind" "public"."DocumentKind" NOT NULL,
ALTER COLUMN "templateId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."DocumentBatch" (
    "id" TEXT NOT NULL,
    "kind" "public"."DocumentKind" NOT NULL,
    "createdByUserId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentBatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentBatch_createdByUserId_idx" ON "public"."DocumentBatch"("createdByUserId");

-- CreateIndex
CREATE INDEX "DocumentBatch_createdAt_idx" ON "public"."DocumentBatch"("createdAt");

-- CreateIndex
CREATE INDEX "GeneratedDocument_kind_idx" ON "public"."GeneratedDocument"("kind");

-- CreateIndex
CREATE INDEX "GeneratedDocument_batchId_idx" ON "public"."GeneratedDocument"("batchId");

-- AddForeignKey
ALTER TABLE "public"."GeneratedDocument" ADD CONSTRAINT "GeneratedDocument_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."DocumentTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GeneratedDocument" ADD CONSTRAINT "GeneratedDocument_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."DocumentBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentBatch" ADD CONSTRAINT "DocumentBatch_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
