import { NextRequest, NextResponse } from 'next/server';
import { createPortalSession } from '@/lib/stripe';
import { authMiddleware } from '@/lib/auth';
import db from '@/lib/db';

async function handler(req: NextRequest) {
  // @ts-ignore
  const userId = req.user.userId;

  try {
    // Fetch user's Stripe customer ID
    const result = await db.query('SELECT stripe_customer_id FROM creator_profiles WHERE user_id = $1', [userId]);
    const customerId = result.rows[0]?.stripe_customer_id;

    if (!customerId) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    const session = await createPortalSession(customerId);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
  }
}

export const POST = authMiddleware(handler);