/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `Secrets` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Secrets" ADD COLUMN     "refreshToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Secrets_refreshToken_key" ON "Secrets"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
