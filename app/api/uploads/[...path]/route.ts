import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'public', 'uploads');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filename = pathSegments.join('/');

    console.log('[Image Serve] Request for:', filename);
    console.log('[Image Serve] Storage dir:', STORAGE_DIR);

    // Security: prevent directory traversal
    if (filename.includes('..') || filename.startsWith('/')) {
      console.error('[Image Serve] Invalid filename detected:', filename);
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const filePath = path.join(STORAGE_DIR, filename);
    console.log('[Image Serve] Full path:', filePath);
    console.log('[Image Serve] File exists?', existsSync(filePath));

    // Check if file exists
    if (!existsSync(filePath)) {
      console.error('[Image Serve] File not found:', filePath);
      return NextResponse.json({
        error: 'File not found',
        path: filePath,
        storageDir: STORAGE_DIR,
        filename
      }, { status: 404 });
    }

    console.log('[Image Serve] File found, serving:', filename);

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Determine content type based on extension
    const ext = path.extname(filename).toLowerCase();
    const contentTypeMap: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.bmp': 'image/bmp',
      '.svg': 'image/svg+xml',
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    // Return the image with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
