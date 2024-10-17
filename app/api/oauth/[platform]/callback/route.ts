import { NextRequest, NextResponse } from 'next/server';
import { handleOAuthCallback } from '@/lib/oauth';

export async function GET(req: NextRequest, { params }: { params: { platform: string } }) {
  try {
    const result = await handleOAuthCallback(req, params.platform);
    return NextResponse.redirect('/dashboard?tab=content');
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    return NextResponse.redirect('/dashboard?error=oauth_failed');
  }
}