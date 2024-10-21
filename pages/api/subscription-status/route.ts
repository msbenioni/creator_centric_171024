import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from '@/lib/auth';
import db from '@/lib/db';

async function getSubscriptionStatus(req: NextRequest) {
  // @ts-ignore
  const userId = req.user.userId;

  try {
    const result = await db.query(
      'SELECT subscription_status FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ status: 'free' });
    }

    return NextResponse.json({ status: result.rows[0].subscription_status });
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = authMiddleware(getSubscriptionStatus);