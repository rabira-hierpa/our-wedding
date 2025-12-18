import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      include: {
        guest: true,
        likes: true,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });

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
