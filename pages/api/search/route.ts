import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const result = await db.query(
      `SELECT id, name, email FROM users 
       WHERE name ILIKE $1 OR email ILIKE $1
       LIMIT 20`,
      [`%${query}%`]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error searching creators:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}