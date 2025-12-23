import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Server-Sent Events endpoint for real-time updates
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  // Create a TransformStream for SSE
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  let lastPhotoCount = 0;
  let lastWishCount = 0;

  // Function to send SSE message
  const sendEvent = async (data: any) => {
    try {
      await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
    } catch (error) {
      console.error("Error writing SSE:", error);
    }
  };

  // Poll database every 15 seconds and push updates
  const checkUpdates = async () => {
    try {
      const [photoCount, wishCount] = await Promise.all([
        prisma.photo.count(),
        prisma.wish.count(),
      ]);

      if (photoCount > lastPhotoCount) {
        // Get latest photo
        const latestPhoto = await prisma.photo.findFirst({
          orderBy: { uploadedAt: "desc" },
          include: { guest: true },
        });

        if (latestPhoto) {
          await sendEvent({
            type: "photo",
            count: photoCount,
            data: {
              caption: latestPhoto.caption,
              guest: {
                firstName: latestPhoto.guest.firstName,
                lastName: latestPhoto.guest.lastName,
              },
            },
          });
        }
        lastPhotoCount = photoCount;
      }

      if (wishCount > lastWishCount) {
        // Get latest wish
        const latestWish = await prisma.wish.findFirst({
          orderBy: { createdAt: "desc" },
          include: { guest: true },
        });

        if (latestWish) {
          await sendEvent({
            type: "wish",
            count: wishCount,
            data: {
              message: latestWish.message,
              guest: {
                firstName: latestWish.guest.firstName,
                lastName: latestWish.guest.lastName,
              },
            },
          });
        }
        lastWishCount = wishCount;
      }
    } catch (error) {
      console.error("Error checking updates:", error);
    }
  };

  // Initialize counts
  try {
    lastPhotoCount = await prisma.photo.count();
    lastWishCount = await prisma.wish.count();
  } catch (error) {
    console.error("Error initializing counts:", error);
  }

  // Send initial connection message
  await sendEvent({ type: "connected", message: "SSE connection established" });

  // Check for updates every 15 seconds
  const interval = setInterval(checkUpdates, 15000);

  // Cleanup on client disconnect
  request.signal.addEventListener("abort", () => {
    clearInterval(interval);
    writer.close();
  });

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable nginx buffering
    },
  });
}
