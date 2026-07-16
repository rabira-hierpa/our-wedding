import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const filter = searchParams.get("filter") || "all"; // all | visible | hidden
    const sort = searchParams.get("sort") || "uploadedAt"; // uploadedAt | likes

    const where =
      filter === "visible"
        ? { isHidden: false }
        : filter === "hidden"
          ? { isHidden: true }
          : {};

    const photos = await prisma.photo.findMany({
      where,
      include: {
        guest: true,
        likes: true,
      },
      orderBy:
        sort === "likes"
          ? { likes: { _count: "desc" } }
          : { uploadedAt: "desc" },
    });

    return NextResponse.json({
      photos: photos.map((photo) => ({
        ...photo,
        likeCount: photo.likes.length,
        likes: undefined,
        guest: {
          ...photo.guest,
          telegramUserId: photo.guest.telegramUserId.toString(),
        },
      })),
    });
  } catch (error) {
    console.error("Error in GET /api/admin/photos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
