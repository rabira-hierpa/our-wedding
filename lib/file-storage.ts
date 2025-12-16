import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// For VPS deployment: photos stored in /var/www/wedding-photos or similar
// For Docker/Coolify: use a volume mount
const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'public', 'uploads');
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/**
 * Ensures the storage directory exists
 */
async function ensureStorageDir() {
  if (!existsSync(STORAGE_DIR)) {
    await mkdir(STORAGE_DIR, { recursive: true });
  }
}

/**
 * Uploads a photo to local file system
 */
export async function uploadPhotoToStorage(
  fileBuffer: Buffer,
  fileName: string
): Promise<{ path: string; publicUrl: string } | null> {
  try {
    await ensureStorageDir();

    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `${timestamp}-${sanitizedFileName}`;
    const fullPath = path.join(STORAGE_DIR, storagePath);

    // Write file to disk
    await writeFile(fullPath, fileBuffer);

    // Generate public URL - use /api/uploads/ for Next.js standalone mode
    const publicUrl = `${BASE_URL}/api/uploads/${storagePath}`;

    return {
      path: storagePath,
      publicUrl,
    };
  } catch (error) {
    console.error('Error uploading to file storage:', error);
    return null;
  }
}

/**
 * Deletes a photo from local file system
 */
export async function deletePhotoFromStorage(filePath: string): Promise<boolean> {
  try {
    const { unlink } = await import('fs/promises');
    const fullPath = path.join(STORAGE_DIR, filePath);

    if (existsSync(fullPath)) {
      await unlink(fullPath);
    }

    return true;
  } catch (error) {
    console.error('Error deleting from file storage:', error);
    return false;
  }
}
