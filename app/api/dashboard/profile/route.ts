import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { creatorMiddleware } from '@/lib/auth';

async function getProfile(req: NextRequest) {
  // @ts-ignore
  const userId = req.user.userId;

  try {
    const result = await db.query('SELECT name, email, bio FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function updateProfile(req: NextRequest) {
  // @ts-ignore
  const userId = req.user.userId;
  const { name, bio } = await req.json();

  try {
    const result = await db.query(
      'UPDATE users SET name = $1, bio = $2 WHERE id = $3 RETURNING name, email, bio',
      [name, bio, userId]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = creatorMiddleware(getProfile);
export const PUT = creatorMiddleware(updateProfile);