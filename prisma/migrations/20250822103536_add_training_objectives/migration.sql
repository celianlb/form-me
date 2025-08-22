-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('CLIENT', 'ADMIN', 'LEARNER');

-- CreateEnum
CREATE TYPE "public"."RequestProfile" AS ENUM ('INDIVIDUAL', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "public"."TrainingMode" AS ENUM ('PARTNER_CENTER', 'E_LEARNING');

-- CreateEnum
CREATE TYPE "public"."ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."GroupMemberStatus" AS ENUM ('INVITED', 'ACTIVE', 'REMOVED');

-- CreateEnum
CREATE TYPE "public"."InviteTokenType" AS ENUM ('SET_PASSWORD', 'RESET_PASSWORD');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'CLIENT',
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Training" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "durationHours" INTEGER,
    "durationDays" INTEGER,
    "minParticipants" INTEGER DEFAULT 1,
    "maxParticipants" INTEGER,
    "successRate" DECIMAL(5,2),
    "targetAudience" TEXT,
    "learningObjectives" TEXT,
    "prerequisites" TEXT,
    "technicalMeans" TEXT,
    "teachingMeans" TEXT,
    "evaluationMethods" TEXT,
    "validationMethod" TEXT,
    "monitoringMethods" TEXT,
    "renewalRecommendation" TEXT,
    "priceExclTax" DECIMAL(10,2),
    "availableInCenter" BOOLEAN NOT NULL DEFAULT true,
    "availableElearning" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" "public"."ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdById" INTEGER,
    "updatedById" INTEGER,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrainingModule" (
    "id" SERIAL NOT NULL,
    "trainingId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "type" TEXT,
    "content" TEXT,

    CONSTRAINT "TrainingModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrainingObjective" (
    "id" SERIAL NOT NULL,
    "trainingId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "TrainingObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Support" (
    "id" SERIAL NOT NULL,
    "trainingId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileSize" BIGINT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Support_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AccessSupport" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "supportId" INTEGER NOT NULL,
    "grantedByAdminId" INTEGER NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "AccessSupport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupportGroup" (
    "id" SERIAL NOT NULL,
    "trainingId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SupportGroupMember" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "public"."GroupMemberStatus" NOT NULL DEFAULT 'INVITED',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "SupportGroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InviteToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "type" "public"."InviteTokenType" NOT NULL DEFAULT 'SET_PASSWORD',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InviteToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quote" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "profile" "public"."RequestProfile" NOT NULL,
    "address" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "trainingId" INTEGER,
    "mode" "public"."TrainingMode",
    "numberLearners" INTEGER NOT NULL,
    "preferredDates" TEXT,
    "message" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'received',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrainingVersion" (
    "id" SERIAL NOT NULL,
    "trainingId" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "savedBy" INTEGER,

    CONSTRAINT "TrainingVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "public"."Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Training_slug_key" ON "public"."Training"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingModule_trainingId_order_key" ON "public"."TrainingModule"("trainingId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "AccessSupport_userId_supportId_key" ON "public"."AccessSupport"("userId", "supportId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportGroupMember_groupId_userId_key" ON "public"."SupportGroupMember"("groupId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "InviteToken_token_key" ON "public"."InviteToken"("token");

-- AddForeignKey
ALTER TABLE "public"."Training" ADD CONSTRAINT "Training_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Training" ADD CONSTRAINT "Training_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Training" ADD CONSTRAINT "Training_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrainingModule" ADD CONSTRAINT "TrainingModule_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "public"."Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrainingObjective" ADD CONSTRAINT "TrainingObjective_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "public"."Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Support" ADD CONSTRAINT "Support_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "public"."Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessSupport" ADD CONSTRAINT "AccessSupport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessSupport" ADD CONSTRAINT "AccessSupport_supportId_fkey" FOREIGN KEY ("supportId") REFERENCES "public"."Support"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AccessSupport" ADD CONSTRAINT "AccessSupport_grantedByAdminId_fkey" FOREIGN KEY ("grantedByAdminId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportGroup" ADD CONSTRAINT "SupportGroup_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "public"."Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportGroup" ADD CONSTRAINT "SupportGroup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportGroupMember" ADD CONSTRAINT "SupportGroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."SupportGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SupportGroupMember" ADD CONSTRAINT "SupportGroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InviteToken" ADD CONSTRAINT "InviteToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "public"."Training"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrainingVersion" ADD CONSTRAINT "TrainingVersion_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "public"."Training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
