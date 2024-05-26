/*
  Warnings:

  - You are about to drop the column `termsCondition` on the `requests` table. All the data in the column will be lost.
  - Added the required column `agreeTerms` to the `requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "requests" DROP COLUMN "termsCondition",
ADD COLUMN     "agreeTerms" BOOLEAN NOT NULL;
