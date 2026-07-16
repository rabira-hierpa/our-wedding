import { existsSync } from "fs";
import { mkdir, readdir, unlink, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

// Storage directory - Next.js serves files from public/ automatically
const STORAGE_DIR =
  process.env.STORAGE_DIR || path.join(process.cwd(), "public", "uploads");
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const GRID_THUMB_WIDTH = 720;
const GRID_THUMB_QUALITY = 75;

/**
 * Ensures the storage directory exists
 */
async function ensureStorageDir() {
  if (!existsSync(STORAGE_DIR)) {
    await mkdir(STORAGE_DIR, { recursive: true });
  }
}

/**
 * Converts HEIC/HEIF images to JPEG using sharp
 */
async function convertToJPEG(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ buffer: Buffer; fileName: string }> {
  const ext = path.extname(fileName).toLowerCase();

  // Check if conversion is needed
  if (ext === ".heic" || ext === ".heif") {
    try {
      console.log(`Converting ${fileName} from HEIC/HEIF to JPEG...`);
      const convertedBuffer = await sharp(fileBuffer)
        .jpeg({ quality: 90 })
        .toBuffer();

      const newFileName = fileName.replace(/\.(heic|heif)$/i, ".jpg");
      console.log(`Conversion successful: ${newFileName}`);

      return { buffer: convertedBuffer, fileName: newFileName };
    } catch (error) {
      console.error("Error converting HEIC/HEIF:", error);
      // If conversion fails, return original
      return { buffer: fileBuffer, fileName };
    }
  }

  // No conversion needed
  return { buffer: fileBuffer, fileName };
}

/**
 * Pre-warm the grid thumbnail cache used by /api/uploads?w=720
 */
async function writeGridThumbCache(
  sourcePath: string,
  storagePath: string
): Promise<void> {
  try {
    const cacheDir = path.join(STORAGE_DIR, ".cache");
    await mkdir(cacheDir, { recursive: true });

    const cacheName = `w${GRID_THUMB_WIDTH}-q${GRID_THUMB_QUALITY}-${storagePath}.webp`;
    const cachePath = path.join(cacheDir, cacheName);

    const thumb = await sharp(sourcePath)
      .rotate()
      .resize({ width: GRID_THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: GRID_THUMB_QUALITY })
      .toBuffer();

    await writeFile(cachePath, thumb);
  } catch (error) {
    // Non-fatal: on-the-fly resize still works for existing clients
    console.error("Error writing grid thumb cache:", error);
  }
}

/**
 * Uploads a photo to local file system
 * Automatically converts HEIC/HEIF to JPEG and prebuilds a grid thumb
 */
export async function uploadPhotoToStorage(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ path: string; publicUrl: string } | null> {
  try {
    await ensureStorageDir();

    // Convert HEIC/HEIF to JPEG if needed
    const { buffer: processedBuffer, fileName: processedFileName } =
      await convertToJPEG(fileBuffer, fileName);

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8); // Add random string to prevent collisions
    const sanitizedFileName = processedFileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${timestamp}-${random}-${sanitizedFileName}`;
    const fullPath = path.join(STORAGE_DIR, storagePath);

    // Write file to disk
    await writeFile(fullPath, processedBuffer);

    // Prebuild common gallery thumb so first page views hit disk cache
    await writeGridThumbCache(fullPath, storagePath);

    // Generate public URL - use API route to serve images
    const publicUrl = `${BASE_URL}/api/uploads/${storagePath}`;

    return {
      path: storagePath,
      publicUrl,
    };
  } catch (error) {
    console.error("Error uploading to file storage:", error);
    return null;
  }
}

/**
 * Deletes a photo and any cached resize variants from local file system
 */
export async function deletePhotoFromStorage(
  filePath: string
): Promise<boolean> {
  try {
    const fullPath = path.join(STORAGE_DIR, filePath);

    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }

    const cacheDir = path.join(STORAGE_DIR, ".cache");
    if (existsSync(cacheDir)) {
      const entries = await readdir(cacheDir);
      await Promise.all(
        entries
          .filter((name) => name.includes(filePath))
          .map((name) => unlink(path.join(cacheDir, name)).catch(() => undefined))
      );
    }

    return true;
  } catch (error) {
    console.error("Error deleting from file storage:", error);
    return false;
  }
}
