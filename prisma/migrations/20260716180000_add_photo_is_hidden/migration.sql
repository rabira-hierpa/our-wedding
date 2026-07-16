-- AlterTable
ALTER TABLE "photos" ADD COLUMN "is_hidden" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "photos_is_hidden_idx" ON "photos"("is_hidden");
