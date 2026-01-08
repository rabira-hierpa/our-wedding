import { prisma } from "@/lib/prisma";
import { getCached } from "@/lib/redis";
import { NextResponse } from "next/server";

// Enable ISR caching with 30 second revalidation
export const revalidate = 30;

export async function GET() {
  try {
    // Use Redis cache if available, fallback to DB
    const serializedPhotos = await getCached(
      "photos:all",
      async () => {
        const photos = await prisma.photo.findMany({
          include: {
            guest: true,
            likes: true,
          },
          orderBy: {
            uploadedAt: "desc",
          },
        });

        // Convert BigInt to string BEFORE caching
        return photos.map((photo) => ({
          ...photo,
          likeCount: photo.likes.length,
          likes: photo.likes,
          guest: {
            ...photo.guest,
            telegramUserId: photo.guest.telegramUserId.toString(),
          },
        }));
      },
      30 // 30 second TTL
    );

    return NextResponse.json({ photos: serializedPhotos });
  } catch (error) {
    console.error("Error in GET /api/photos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
