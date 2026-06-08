/*
  Warnings:

  - You are about to drop the column `createdAt` on the `words` table. All the data in the column will be lost.
  - You are about to drop the column `isLearned` on the `words` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "words" DROP COLUMN "createdAt",
DROP COLUMN "isLearned";
