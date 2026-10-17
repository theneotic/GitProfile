import { NextRequest, NextResponse } from 'next/server';
import { uploadStore, pruneUploads } from '../../../lib/uploadStore';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    pruneUploads();
    const contentType = request.headers.get('content-type') || '';

    let buffer: Buffer;
    let mimeType = 'image/png';
    let originalName = 'uploaded-image.png';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file provided in form data' }, { status: 400 });
      }
      originalName = file.name;
      mimeType = file.type || 'image/png';
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      const body = await request.json();
      if (!body.dataUrl) {
        return NextResponse.json({ error: 'No dataUrl provided in JSON body' }, { status: 400 });
      }
      const matches = body.dataUrl.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(body.dataUrl, 'base64');
      }
      if (body.filename) originalName = body.filename;
    }

    // Limit upload to 5MB
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image size exceeds 5MB limit' }, { status: 413 });
    }

    const ext = originalName.includes('.') ? originalName.split('.').pop() : 'png';
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    uploadStore.set(id, {
      buffer,
      contentType: mimeType,
      filename: originalName,
      createdAt: Date.now(),
    });

    const host = request.headers.get('host') || 'gitprofilestat.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const fullUrl = `${protocol}://${host}/api/uploads/${id}`;

    return NextResponse.json({
      success: true,
      id,
      url: `/api/uploads/${id}`,
      fullUrl,
      size: buffer.length,
      mimeType,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
