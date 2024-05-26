-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVATE', 'DEACTIVATED');

-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVATE';
