-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "lastDonationDate" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "bloodType" DROP NOT NULL;
