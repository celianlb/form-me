-- CreateEnum: Add ApplicationType enum
CREATE TYPE "ApplicationType" AS ENUM ('STANDARD', 'APPLICATION');

-- AlterTable: Add applicationType field to Training
ALTER TABLE "Training" ADD COLUMN "applicationType" "ApplicationType" NOT NULL DEFAULT 'STANDARD';
