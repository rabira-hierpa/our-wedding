import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";

const MIN_WIDTH = 100;
const MAX_WIDTH = 1600;
const MIN_QUALITY = 40;
const MAX_QUALITY = 95;
const DEFAULT_QUALITY = 75;

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

function parseBoundedInt(
  value: string | null,
  fallback: number,
  min: number,
  max: number
): number {
  if (value === null || value === "") return fallback;
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function isSafeFilename(filename: string): boolean {
  return (
    !!filename &&
    !filename.includes("..") &&
    !filename.includes("/") &&
    !filename.includes("\\")
  );
}

/**
 * Serve uploaded images. Optional ?w=&q= returns a Sharp-resized variant
 * (WebP when Accept allows it), cached under STORAGE_DIR/.cache/.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;

    if (!isSafeFilename(filename)) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const uploadsDir =
      process.env.STORAGE_DIR || path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, filename);

    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const { searchParams } = request.nextUrl;
    const wParam = searchParams.get("w");

    // No resize requested — serve the original file
    if (wParam === null || wParam === "") {
      const fileBuffer = await readFile(filePath);
      const ext = path.extname(filename).toLowerCase();
      const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

      return new NextResponse(new Uint8Array(fileBuffer), {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const width = parseBoundedInt(wParam, 720, MIN_WIDTH, MAX_WIDTH);
    const quality = parseBoundedInt(
      searchParams.get("q"),
      DEFAULT_QUALITY,
      MIN_QUALITY,
      MAX_QUALITY
    );

    const accept = request.headers.get("accept") || "";
    const useWebp = accept.includes("image/webp");
    const format = useWebp ? "webp" : "jpeg";
    const ext = format === "webp" ? "webp" : "jpg";
    const contentType = format === "webp" ? "image/webp" : "image/jpeg";

    const cacheDir = path.join(uploadsDir, ".cache");
    const cacheName = `w${width}-q${quality}-${filename}.${ext}`;
    const cachePath = path.join(cacheDir, cacheName);

    if (existsSync(cachePath)) {
      const cached = await readFile(cachePath);
      return new NextResponse(new Uint8Array(cached), {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Image-Cache": "HIT",
        },
      });
    }

    const resized = await sharp(filePath)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .toFormat(format, { quality })
      .toBuffer();

    await mkdir(cacheDir, { recursive: true });
    await writeFile(cachePath, resized);

    return new NextResponse(new Uint8Array(resized), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Image-Cache": "MISS",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
