import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function guestName(firstName: string, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ");
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export async function GET() {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const [
      telegramGuests,
      webGuests,
      uploaders,
      photos,
      photosVisible,
      photosHidden,
      wishes,
      likes,
      inWeddingGroup,
      photosForwardedToGroup,
      photosLastHour,
      photosToday,
      uploaderCounts,
      topLikedPhotos,
      recentUploads,
      likesFromTelegram,
      likesFromWeb,
    ] = await Promise.all([
      prisma.guest.count({ where: { telegramUserId: { not: BigInt(0) } } }),
      prisma.guest.count({ where: { telegramUserId: BigInt(0) } }),
      prisma.guest.count({
        where: {
          telegramUserId: { not: BigInt(0) },
          photos: { some: {} },
        },
      }),
      prisma.photo.count(),
      prisma.photo.count({ where: { isHidden: false } }),
      prisma.photo.count({ where: { isHidden: true } }),
      prisma.wish.count(),
      prisma.like.count(),
      prisma.guest.count({
        where: {
          telegramUserId: { not: BigInt(0) },
          inWeddingGroup: true,
        },
      }),
      prisma.photo.count({ where: { groupMessageId: { not: null } } }),
      prisma.photo.count({ where: { uploadedAt: { gte: oneHourAgo } } }),
      prisma.photo.count({ where: { uploadedAt: { gte: startOfToday } } }),
      prisma.guest.findMany({
        where: {
          telegramUserId: { not: BigInt(0) },
          photos: { some: {} },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          telegramUsername: true,
          _count: { select: { photos: true } },
        },
        orderBy: { photos: { _count: "desc" } },
      }),
      prisma.photo.findMany({
        include: {
          guest: true,
          _count: { select: { likes: true } },
        },
        orderBy: { likes: { _count: "desc" } },
        take: 5,
      }),
      prisma.photo.findMany({
        where: { uploadedAt: { gte: fortyEightHoursAgo } },
        select: { uploadedAt: true },
        orderBy: { uploadedAt: "asc" },
      }),
      prisma.like.count({
        where: { guest: { telegramUserId: { not: BigInt(0) } } },
      }),
      prisma.like.count({
        where: { guest: { telegramUserId: BigInt(0) } },
      }),
    ]);

    const photoCounts = uploaderCounts.map((g) => g._count.photos);
    const topUploaders = uploaderCounts.slice(0, 10).map((g) => ({
      guestId: g.id,
      name: guestName(g.firstName, g.lastName),
      username: g.telegramUsername,
      photoCount: g._count.photos,
    }));

    const uploadsByHourMap = new Map<string, number>();
    for (const photo of recentUploads) {
      const d = new Date(photo.uploadedAt);
      d.setMinutes(0, 0, 0);
      const key = d.toISOString();
      uploadsByHourMap.set(key, (uploadsByHourMap.get(key) || 0) + 1);
    }
    const uploadsByHour = Array.from(uploadsByHourMap.entries()).map(
      ([hour, count]) => ({ hour, count })
    );

    return NextResponse.json({
      generatedAt: now.toISOString(),
      overview: {
        telegramGuests,
        webGuests,
        uploaders,
        photos,
        photosVisible,
        photosHidden,
        wishes,
        likes,
        inWeddingGroup,
        photosForwardedToGroup,
        photosLastHour,
        photosToday,
      },
      photosPerUploader: {
        avg:
          photoCounts.length > 0
            ? Math.round(
                (photoCounts.reduce((a, b) => a + b, 0) / photoCounts.length) *
                  10
              ) / 10
            : 0,
        median: median(photoCounts),
        max: photoCounts.length > 0 ? Math.max(...photoCounts) : 0,
      },
      topUploaders,
      topLiked: topLikedPhotos.map((p) => ({
        photoId: p.id,
        publicUrl: p.publicUrl,
        likeCount: p._count.likes,
        guestName: guestName(p.guest.firstName, p.guest.lastName),
        isHidden: p.isHidden,
      })),
      uploadsByHour,
      breakdown: {
        likesFromTelegram,
        likesFromWeb,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
