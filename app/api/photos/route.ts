import { prisma } from "@/lib/prisma";
import { getCached } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 30;

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 48;
const DEFAULT_FEATURED_LIMIT = 5;

type SerializedPhoto = {
  id: string;
  guestId: string;
  telegramFileId: string | null;
  storagePath: string;
  publicUrl: string;
  caption: string | null;
  uploadedAt: Date | string;
  groupMessageId: string | null;
  isHidden: boolean;
  likeCount: number;
  likes: unknown[];
  guest: {
    id: string;
    telegramUserId: string;
    firstName: string;
    lastName: string | null;
    telegramUsername: string | null;
    registeredAt: Date | string;
  };
};

function serializePhoto(photo: {
  id: string;
  guestId: string;
  telegramFileId: string | null;
  storagePath: string;
  publicUrl: string;
  caption: string | null;
  uploadedAt: Date;
  groupMessageId: string | null;
  isHidden: boolean;
  likes: unknown[];
  guest: {
    id: string;
    telegramUserId: bigint | number;
    firstName: string;
    lastName: string | null;
    telegramUsername: string | null;
    registeredAt: Date;
  };
  _count?: { likes: number };
}): SerializedPhoto {
  return {
    id: photo.id,
    guestId: photo.guestId,
    telegramFileId: photo.telegramFileId,
    storagePath: photo.storagePath,
    publicUrl: photo.publicUrl,
    caption: photo.caption,
    uploadedAt: photo.uploadedAt,
    groupMessageId: photo.groupMessageId,
    isHidden: photo.isHidden,
    likeCount: photo._count?.likes ?? photo.likes.length,
    likes: photo.likes,
    guest: {
      ...photo.guest,
      telegramUserId: photo.guest.telegramUserId.toString(),
    },
  };
}

function parseLimit(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n < 1) return fallback;
  return Math.min(MAX_LIMIT, n);
}

function encodeCursor(uploadedAt: Date | string, id: string): string {
  const iso =
    typeof uploadedAt === "string" ? uploadedAt : uploadedAt.toISOString();
  return Buffer.from(`${iso}::${id}`).toString("base64url");
}

function decodeCursor(
  cursor: string
): { uploadedAt: Date; id: string } | null {
  try {
    const raw = Buffer.from(cursor, "base64url").toString("utf8");
    const [iso, id] = raw.split("::");
    if (!iso || !id) return null;
    const uploadedAt = new Date(iso);
    if (Number.isNaN(uploadedAt.getTime())) return null;
    return { uploadedAt, id };
  } catch {
    return null;
  }
}

async function getFeaturedPhotos(limit: number): Promise<SerializedPhoto[]> {
  return getCached(
    `photos:featured:${limit}`,
    async () => {
      const photos = await prisma.photo.findMany({
        where: { isHidden: false },
        include: {
          guest: true,
          likes: true,
          _count: { select: { likes: true } },
        },
        orderBy: [
          { likes: { _count: "desc" } },
          { uploadedAt: "desc" },
        ],
        take: limit,
      });
      return photos.map(serializePhoto);
    },
    30
  );
}

async function getPaginatedPhotos(
  limit: number,
  cursor: string | null
): Promise<{ photos: SerializedPhoto[]; nextCursor: string | null; total: number }> {
  const decoded = cursor ? decodeCursor(cursor) : null;
  const cacheKey = `photos:page:${cursor || "start"}:${limit}`;

  return getCached(
    cacheKey,
    async () => {
      const where = {
        isHidden: false as const,
        ...(decoded
          ? {
              OR: [
                { uploadedAt: { lt: decoded.uploadedAt } },
                {
                  uploadedAt: decoded.uploadedAt,
                  id: { lt: decoded.id },
                },
              ],
            }
          : {}),
      };

      const [rows, total] = await Promise.all([
        prisma.photo.findMany({
          where,
          include: {
            guest: true,
            likes: true,
            _count: { select: { likes: true } },
          },
          orderBy: [{ uploadedAt: "desc" }, { id: "desc" }],
          take: limit + 1,
        }),
        prisma.photo.count({ where: { isHidden: false } }),
      ]);

      const hasMore = rows.length > limit;
      const page = hasMore ? rows.slice(0, limit) : rows;
      const photos = page.map(serializePhoto);
      const last = page[page.length - 1];
      const nextCursor =
        hasMore && last
          ? encodeCursor(last.uploadedAt, last.id)
          : null;

      return { photos, nextCursor, total };
    },
    30
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const featured = searchParams.get("featured") === "1";
    const limit = parseLimit(
      searchParams.get("limit"),
      featured ? DEFAULT_FEATURED_LIMIT : DEFAULT_LIMIT
    );

    if (featured) {
      const photos = await getFeaturedPhotos(limit);
      return NextResponse.json({
        photos,
        nextCursor: null,
        total: photos.length,
      });
    }

    const cursor = searchParams.get("cursor");
    const result = await getPaginatedPhotos(limit, cursor);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in GET /api/photos:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
