import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Toggle like on a photo
export async function POST(request: NextRequest) {
  try {
    const { photoId, guestId } = await request.json();

    if (!photoId || !guestId) {
      return NextResponse.json(
        { error: "photoId and guestId are required" },
        { status: 400 }
      );
    }

    // Verify the photo exists
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      return NextResponse.json(
        { error: "Photo not found" },
        { status: 404 }
      );
    }

    // Verify the guest exists
    const guest = await prisma.guest.findUnique({
      where: { id: guestId },
    });

    if (!guest) {
      return NextResponse.json(
        { error: "Guest not found. Please ensure you are registered." },
        { status: 404 }
      );
    }

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        photoId_guestId: {
          photoId,
          guestId,
        },
      },
    });

    if (existingLike) {
      // Unlike - remove the like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json({ liked: false });
    } else {
      // Like - create new like
      await prisma.like.create({
        data: {
          photoId,
          guestId,
        },
      });

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

// Get like count for a photo
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get("photoId");

    if (!photoId) {
      return NextResponse.json(
        { error: "photoId is required" },
        { status: 400 }
      );
    }

    const likeCount = await prisma.like.count({
      where: {
        photoId,
      },
    });

    return NextResponse.json({ count: likeCount });
  } catch (error) {
    console.error("Error fetching like count:", error);
    return NextResponse.json(
      { error: "Failed to fetch like count" },
      { status: 500 }
    );
  }
}
