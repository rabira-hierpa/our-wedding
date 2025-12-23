import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

// Storage directory - Next.js serves files from public/ automatically
const STORAGE_DIR =
  process.env.STORAGE_DIR || path.join(process.cwd(), "public", "uploads");
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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
async function convertToJPEG(fileBuffer: Buffer, fileName: string): Promise<{ buffer: Buffer; fileName: string }> {
  const ext = path.extname(fileName).toLowerCase();
  
  // Check if conversion is needed
  if (ext === '.heic' || ext === '.heif') {
    try {
      console.log(`Converting ${fileName} from HEIC/HEIF to JPEG...`);
      const convertedBuffer = await sharp(fileBuffer)
        .jpeg({ quality: 90 })
        .toBuffer();
      
      const newFileName = fileName.replace(/\.(heic|heif)$/i, '.jpg');
      console.log(`Conversion successful: ${newFileName}`);
      
      return { buffer: convertedBuffer, fileName: newFileName };
    } catch (error) {
      console.error('Error converting HEIC/HEIF:', error);
      // If conversion fails, return original
      return { buffer: fileBuffer, fileName };
    }
  }
  
  // No conversion needed
  return { buffer: fileBuffer, fileName };
}

/**
 * Uploads a photo to local file system
 * Automatically converts HEIC/HEIF to JPEG
 */
export async function uploadPhotoToStorage(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ path: string; publicUrl: string } | null> {
  try {
    await ensureStorageDir();

    // Convert HEIC/HEIF to JPEG if needed
    const { buffer: processedBuffer, fileName: processedFileName } = await convertToJPEG(fileBuffer, fileName);

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8); // Add random string to prevent collisions
    const sanitizedFileName = processedFileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const storagePath = `${timestamp}-${random}-${sanitizedFileName}`;
    const fullPath = path.join(STORAGE_DIR, storagePath);

    // Write file to disk
    await writeFile(fullPath, processedBuffer);

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
 * Deletes a photo from local file system
 */
export async function deletePhotoFromStorage(
  filePath: string
): Promise<boolean> {
  try {
    const { unlink } = await import("fs/promises");
    const fullPath = path.join(STORAGE_DIR, filePath);

    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }

    return true;
  } catch (error) {
    console.error("Error deleting from file storage:", error);
    return false;
  }
}
