-- CreateEnum
CREATE TYPE "SeniorApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'NOT_APPLIED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "seniorApplicationStatus" "SeniorApplicationStatus" NOT NULL DEFAULT 'NOT_APPLIED';
