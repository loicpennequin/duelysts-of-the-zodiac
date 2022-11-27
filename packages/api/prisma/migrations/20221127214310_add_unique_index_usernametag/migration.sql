/*
  Warnings:

  - A unique constraint covering the columns `[username,usernameTag]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_username_usernameTag_key` ON `User`(`username`, `usernameTag`);
