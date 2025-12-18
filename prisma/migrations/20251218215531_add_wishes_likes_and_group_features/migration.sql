-- AlterTable
ALTER TABLE "guests" ADD COLUMN     "in_wedding_group" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "wishes" (
    "id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "photo_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wishes_guest_id_idx" ON "wishes"("guest_id");

-- CreateIndex
CREATE INDEX "wishes_created_at_idx" ON "wishes"("created_at" DESC);

-- CreateIndex
CREATE INDEX "likes_photo_id_idx" ON "likes"("photo_id");

-- CreateIndex
CREATE INDEX "likes_guest_id_idx" ON "likes"("guest_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_photo_id_guest_id_key" ON "likes"("photo_id", "guest_id");

-- AddForeignKey
ALTER TABLE "wishes" ADD CONSTRAINT "wishes_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
