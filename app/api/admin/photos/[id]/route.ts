import { prisma } from "@/lib/prisma";
import { deletePhotoFromStorage } from "@/lib/file-storage";
import { invalidateCache } from "@/lib/redis";
import { deleteMessage } from "@/lib/telegram";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const WEDDING_GROUP_CHAT_ID = process.env.WEDDING_GROUP_CHAT_ID
  ? Number(process.env.WEDDING_GROUP_CHAT_ID)
  : null;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (typeof body.isHidden !== "boolean") {
      return NextResponse.json(
        { error: "isHidden boolean is required" },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.update({
      where: { id },
      data: { isHidden: body.isHidden },
      include: { guest: true, likes: true },
    });

    await invalidateCache("photos:*");

    return NextResponse.json({
      photo: {
        ...photo,
        likeCount: photo.likes.length,
        likes: undefined,
        guest: {
          ...photo.guest,
          telegramUserId: photo.guest.telegramUserId.toString(),
        },
      },
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/photos/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    await deletePhotoFromStorage(photo.storagePath);

    if (photo.groupMessageId && WEDDING_GROUP_CHAT_ID) {
      try {
        await deleteMessage(
          WEDDING_GROUP_CHAT_ID,
          parseInt(photo.groupMessageId, 10)
        );
      } catch (error) {
        console.error("Error deleting photo from group:", error);
      }
    }

    await prisma.photo.delete({ where: { id } });
    await invalidateCache("photos:*");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/photos/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
