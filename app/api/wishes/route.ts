import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Enable ISR caching with 30 second revalidation
export const revalidate = 30;

// GET all wishes
export async function GET() {
  try {
    const wishes = await prisma.wish.findMany({
      include: {
        guest: {
          select: {
            firstName: true,
            lastName: true,
            telegramUsername: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(wishes);
  } catch (error) {
    console.error("Error fetching wishes:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishes" },
      { status: 500 }
    );
  }
}

// POST a new wish
export async function POST(request: NextRequest) {
  try {
    const { message, guestId } = await request.json();

    if (!message || !guestId) {
      return NextResponse.json(
        { error: "message and guestId are required" },
        { status: 400 }
      );
    }

    // For web users, create or get guest
    const guest = await prisma.guest.upsert({
      where: { id: guestId },
      create: {
        id: guestId,
        telegramUserId: BigInt(0),
        firstName: "Web Guest",
      },
      update: {},
    });

    // Create the wish
    const wish = await prisma.wish.create({
      data: {
        message,
        guestId: guest.id,
      },
      include: {
        guest: {
          select: {
            firstName: true,
            lastName: true,
            telegramUsername: true,
          },
        },
      },
    });

    return NextResponse.json(wish, { status: 201 });
  } catch (error) {
    console.error("Error creating wish:", error);
    return NextResponse.json(
      { error: "Failed to create wish" },
      { status: 500 }
    );
  }
}
