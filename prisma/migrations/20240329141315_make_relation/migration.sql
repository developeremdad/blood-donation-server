/*
  Warnings:

  - A unique constraint covering the columns `[requesterId]` on the table `requests` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "requests" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "requests_requesterId_key" ON "requests"("requesterId");

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
