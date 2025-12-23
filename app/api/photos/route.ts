import { prisma } from "@/lib/prisma";
import { getCached } from "@/lib/redis";
import { NextResponse } from "next/server";

// Enable ISR caching with 30 second revalidation
export const revalidate = 30;

export async function GET() {
  try {
    // Use Redis cache if available, fallback to DB
    const photos = await getCached(
      "photos:all",
      async () => {
        return await prisma.photo.findMany({
          include: {
            guest: true,
            likes: true,
          },
          orderBy: {
            uploadedAt: "desc",
          },
        });
      },
      30 // 30 second TTL
    );

    // Convert BigInt to string for JSON serialization
    const serializedPhotos = photos.map((photo) => ({
      ...photo,
      likeCount: photo.likes.length,
      likes: photo.likes,
      guest: {
        ...photo.guest,
        telegramUserId: photo.guest.telegramUserId.toString(),
      },
    }));

    return NextResponse.json({ photos: serializedPhotos });
  } catch (error) {
    console.error("Error in GET /api/photos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
