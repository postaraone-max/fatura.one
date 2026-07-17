-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "subscriptionStatus" TEXT DEFAULT 'active';
