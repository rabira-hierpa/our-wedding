import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      include: {
        guest: true,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    // Convert BigInt to string for JSON serialization
    const serializedPhotos = photos.map((photo) => ({
      ...photo,
      guest: {
        ...photo.guest,
        telegramUserId: photo.guest.telegramUserId.toString(),
      },
    }));

    return NextResponse.json({ photos: serializedPhotos });
  } catch (error) {
    console.error('Error in GET /api/photos:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
