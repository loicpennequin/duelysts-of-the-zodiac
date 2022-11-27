/*
  Warnings:

  - You are about to drop the column `passwordResetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_refreshToken_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `passwordResetToken`,
    DROP COLUMN `refreshToken`;

-- CreateTable
CREATE TABLE `RefreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `value` VARCHAR(200) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RefreshToken_id_key`(`id`),
    UNIQUE INDEX `RefreshToken_value_key`(`value`),
    UNIQUE INDEX `RefreshToken_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PasswordResetToken` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `value` VARCHAR(200) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PasswordResetToken_id_key`(`id`),
    UNIQUE INDEX `PasswordResetToken_value_key`(`value`),
    UNIQUE INDEX `PasswordResetToken_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefreshToken` ADD CONSTRAINT `RefreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
