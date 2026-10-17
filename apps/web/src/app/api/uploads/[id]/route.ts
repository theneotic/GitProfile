import { NextRequest, NextResponse } from 'next/server';
import { uploadStore } from '../../../../lib/uploadStore';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = uploadStore.get(id);

  if (!item) {
    return new NextResponse('Image not found or expired', { status: 404 });
  }

  return new NextResponse(new Uint8Array(item.buffer), {
    status: 200,
    headers: {
      'Content-Type': item.contentType,
      'Content-Length': String(item.buffer.length),
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
