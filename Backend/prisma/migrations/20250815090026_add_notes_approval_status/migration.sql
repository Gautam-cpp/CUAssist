-- CreateEnum
CREATE TYPE "NoteStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "reviewedBy" TEXT,
ADD COLUMN     "status" "NoteStatus" NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_reviewedBy_fkey" FOREIGN KEY ("reviewedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
