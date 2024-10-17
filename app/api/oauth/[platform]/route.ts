import { NextRequest, NextResponse } from 'next/server';
import { getOAuthUrl } from '@/lib/oauth';
import { authMiddleware } from '@/lib/auth';

async function handler(req: NextRequest, { params }: { params: { platform: string } }) {
  try {
    const url = await getOAuthUrl(params.platform);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error generating OAuth URL:', error);
    return NextResponse.json({ error: 'Failed to generate OAuth URL' }, { status: 500 });
  }
}

export const GET = authMiddleware(handler);