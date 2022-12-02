/*
  Warnings:

  - Made the column `stageId` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Game` MODIFY `stageId` VARCHAR(191) NOT NULL;
