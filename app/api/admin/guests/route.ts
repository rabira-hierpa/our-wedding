import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function guestName(firstName: string, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(" ");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const source = searchParams.get("source") || "telegram";
    const sort = searchParams.get("sort") || "photos";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";
    const q = (searchParams.get("q") || "").trim();
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(
      100,
      Math.max(1, Number(searchParams.get("pageSize") || 25))
    );

    const where: Prisma.GuestWhereInput = {};

    if (source === "telegram") {
      where.telegramUserId = { not: BigInt(0) };
    } else if (source === "web") {
      where.telegramUserId = BigInt(0);
    }

    if (q) {
      where.OR = [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { telegramUsername: { contains: q, mode: "insensitive" } },
      ];
    }

    const orderBy: Prisma.GuestOrderByWithRelationInput =
      sort === "wishes"
        ? { wishes: { _count: order } }
        : sort === "registered"
          ? { registeredAt: order }
          : { photos: { _count: order } };

    // lastUpload needs post-sort; fetch and sort in memory for that case
    if (sort === "lastUpload") {
      const [total, guests] = await Promise.all([
        prisma.guest.count({ where }),
        prisma.guest.findMany({
          where,
          include: {
            _count: {
              select: { photos: true, wishes: true, likes: true },
            },
            photos: {
              select: { uploadedAt: true },
              orderBy: { uploadedAt: "desc" },
              take: 1,
            },
          },
        }),
      ]);

      const rows = guests
        .map((g) => ({
          id: g.id,
          name: guestName(g.firstName, g.lastName),
          username: g.telegramUsername,
          source: g.telegramUserId === BigInt(0) ? "web" : "telegram",
          registeredAt: g.registeredAt.toISOString(),
          photoCount: g._count.photos,
          wishCount: g._count.wishes,
          likesGiven: g._count.likes,
          inWeddingGroup: g.inWeddingGroup,
          lastUploadAt: g.photos[0]?.uploadedAt.toISOString() ?? null,
        }))
        .sort((a, b) => {
          const aTime = a.lastUploadAt ? new Date(a.lastUploadAt).getTime() : 0;
          const bTime = b.lastUploadAt ? new Date(b.lastUploadAt).getTime() : 0;
          return order === "asc" ? aTime - bTime : bTime - aTime;
        });

      const start = (page - 1) * pageSize;
      const pageRows = rows.slice(start, start + pageSize);

      return NextResponse.json({
        guests: pageRows,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    }

    const [total, guests] = await Promise.all([
      prisma.guest.count({ where }),
      prisma.guest.findMany({
        where,
        include: {
          _count: {
            select: { photos: true, wishes: true, likes: true },
          },
          photos: {
            select: { uploadedAt: true },
            orderBy: { uploadedAt: "desc" },
            take: 1,
          },
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      guests: guests.map((g) => ({
        id: g.id,
        name: guestName(g.firstName, g.lastName),
        username: g.telegramUsername,
        source: g.telegramUserId === BigInt(0) ? "web" : "telegram",
        registeredAt: g.registeredAt.toISOString(),
        photoCount: g._count.photos,
        wishCount: g._count.wishes,
        likesGiven: g._count.likes,
        inWeddingGroup: g.inWeddingGroup,
        lastUploadAt: g.photos[0]?.uploadedAt.toISOString() ?? null,
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/guests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
