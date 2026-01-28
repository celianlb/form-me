-- Migration: Simplify Training Model
-- Description: Remove pricing, capacity, location fields and add imageUrl
-- Warning: This migration is destructive and will delete data

-- 1. Delete ONE and DSA formations first (before removing columns)
DELETE FROM "Training" WHERE slug IN ('dsa-digital-success-academy', 'formation-one-ecole-digitale');

-- 2. Add new imageUrl column
ALTER TABLE "Training" ADD COLUMN "imageUrl" TEXT;

-- 3. Drop deprecated columns from Training
ALTER TABLE "Training" DROP COLUMN IF EXISTS "minParticipants";
ALTER TABLE "Training" DROP COLUMN IF EXISTS "maxParticipants";
ALTER TABLE "Training" DROP COLUMN IF EXISTS "pricePartnerPerDay";
ALTER TABLE "Training" DROP COLUMN IF EXISTS "priceNonPartnerPerTrainee";
ALTER TABLE "Training" DROP COLUMN IF EXISTS "availableForPartners";
ALTER TABLE "Training" DROP COLUMN IF EXISTS "applicationType";
ALTER TABLE "Training" DROP COLUMN IF EXISTS "availableInCenter";
ALTER TABLE "Training" DROP COLUMN IF EXISTS "availableElearning";

-- 4. Drop the ApplicationType enum (after removing the column that uses it)
DROP TYPE IF EXISTS "ApplicationType";
