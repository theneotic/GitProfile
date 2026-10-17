import { NextRequest } from 'next/server';
import { processOAuthCallback } from '../../../../lib/oauth-handler';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return processOAuthCallback(request);
}
