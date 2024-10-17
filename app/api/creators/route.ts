import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const result = await db.query('SELECT id, name, email FROM users');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching creators:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}