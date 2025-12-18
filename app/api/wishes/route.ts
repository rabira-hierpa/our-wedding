import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
