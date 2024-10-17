import { NextRequest, NextResponse } from 'next/server';
import { paidFeatureMiddleware } from '@/lib/auth';
import db from '@/lib/db';

async function createAffiliateLink(req: NextRequest) {
  // @ts-ignore
  const userId = req.user.userId;
  const { postId, productName, linkUrl } = await req.json();

  try {
    const result = await db.query(
      'INSERT INTO affiliate_links (user_id, post_id, product_name, link_url) VALUES ($1, $2, $3, $4) RETURNING id',
      [userId, postId, productName, linkUrl]
    );
    return NextResponse.json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error creating affiliate link:', error);
    return NextResponse.json({ error: 'Failed to create affiliate link' }, { status: 500 });
  }
}

async function getAffiliateLinks(req: NextRequest) {
  // @ts-ignore
  const userId = req.user.userId;

  try {
    const result = await db.query(
      'SELECT * FROM affiliate_links WHERE user_id = $1',
      [userId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching affiliate links:', error);
    return NextResponse.json({ error: 'Failed to fetch affiliate links' }, { status: 500 });
  }
}

export const POST = paidFeatureMiddleware(createAffiliateLink);
export const GET = paidFeatureMiddleware(getAffiliateLinks);