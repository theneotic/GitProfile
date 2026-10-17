import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const response = NextResponse.json({ success: true, message: 'Logged out' });

  response.cookies.delete('instrument_session');
  return response;
}
