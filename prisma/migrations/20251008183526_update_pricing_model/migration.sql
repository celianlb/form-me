-- AlterTable: Update Training pricing model
-- Add new price fields
ALTER TABLE "Training" ADD COLUMN "pricePartnerPerDay" DECIMAL(10,2);
ALTER TABLE "Training" ADD COLUMN "priceNonPartnerPerTrainee" DECIMAL(10,2);
ALTER TABLE "Training" ADD COLUMN "availableForPartners" BOOLEAN NOT NULL DEFAULT false;

-- Drop old price field
ALTER TABLE "Training" DROP COLUMN "priceExclTax";
